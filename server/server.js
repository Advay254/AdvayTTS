const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use(cors());
app.use(bodyParser.json({limit: '200kb'})); // small payloads
app.use(morgan('tiny'));

// Helper: safe filename
function tmpFile(ext='wav'){
  return path.join(os.tmpdir(), 'advay_tts_' + uuidv4() + '.' + ext);
}

// Map accents to espeak voice tags (best effort)
const ACCENT_MAP = {
  'en-us':'en-us',
  'en-gb':'en-gb',
  'en-au':'en-au',
  'en-in':'en-in',
  'en-ng':'en-ng', // may fallback
  'en-za':'en-za',
  'en-ca':'en-us', // fallback
  'en-ie':'en-ie',
  'en-ph':'en-us',
  'en-nz':'en-nz',
  'en-tt':'en-us',
  'en-ck':'en-us'
};

// map tone to pitch/rate adjustments
function toneToParams(tone, intensity){
  // intensity 0.0 - 1.4
  const base = {pitch:50, speed:170, amplitude:100}; // espeak defaults
  const adj = {pitch:0, speed:0};
  switch(tone){
    case 'happy': adj.pitch = Math.round(10 + intensity*40); adj.speed = Math.round(0 + intensity*18); break;
    case 'angry': adj.pitch = Math.round(-8 - intensity*30); adj.speed = Math.round(20 + intensity*40); break;
    case 'sad': adj.pitch = Math.round(-12 - intensity*30); adj.speed = Math.round(-20 - intensity*20); break;
    case 'surprised': adj.pitch = Math.round(20 + intensity*50); adj.speed = Math.round(10 + intensity*20); break;
    case 'fear': adj.pitch = Math.round(8 + intensity*30); adj.speed = Math.round(25 + intensity*30); break;
    case 'playful': adj.pitch = Math.round(12 + intensity*30); adj.speed = Math.round(8 + intensity*18); break;
    default: adj.pitch = Math.round(0 + intensity*6); adj.speed = Math.round(0 + intensity*8); break;
  }
  return {
    pitch: Math.max(0, Math.min(99, base.pitch + adj.pitch)),
    speed: Math.max(80, Math.min(400, base.speed + adj.speed)),
    amplitude: base.amplitude
  };
}

// voice mapping for gender+age+preset (best-effort)
function voiceFor(gender, age, preset, accent){
  // espeak voice name format: <lang>-<variant>+<voice>
  // We'll just return accent (mapped) + variant male/female where possible
  const acc = ACCENT_MAP[accent] || 'en-us';
  // choose male/female tag (espeak uses voices like en-us+f3 etc)
  let base = acc;
  let variant = 'm1';
  if(gender === 'female') variant = 'f3';
  // Age adjustments may be applied via pitch and speed rather than voice selection
  return base + '+' + variant; // this is best-effort; espeak may accept 'en-us+f3'
}

app.post('/api/synthesize', async (req, res) => {
  try{
    const { text, gender='male', age=25, tone='normal', intensity=0.6, voice='default', accent='en-us', format='mp3' } = req.body || {};
    if(!text || typeof text !== 'string' || text.trim().length === 0){
      return res.status(400).send('text is required');
    }
    // sanitize
    const cleanText = text.trim().slice(0, 5000); // prevent huge payloads
    const params = toneToParams(tone, Number(intensity) || 0.6);
    const voiceName = voiceFor(gender, age, voice, accent);

    // prepare temporary files
    const outWav = tmpFile('wav');
    const outMp3 = tmpFile('mp3');

    // build espeak-ng args
    // -w <file> write wav
    // -v <voice> voice variant (lang+variant)
    // -s <speed> speed in words per minute
    // -p <pitch> pitch 0..99
    // -a <amplitude> 0..200
    const espeakArgs = [
      '-w', outWav,
      '-v', voiceName,
      '-s', String(params.speed),
      '-p', String(params.pitch),
      '-a', String(params.amplitude),
      cleanText
    ];

    // spawn espeak-ng
    await new Promise((resolve, reject) => {
      const es = spawn('espeak-ng', espeakArgs, {stdio:'ignore', shell:false});
      es.on('error', (err)=> reject(err));
      es.on('exit', (code) => {
        if(code === 0) resolve();
        else reject(new Error('espeak-ng failed with code ' + code));
      });
    });

    // if format=mp3 convert using lame (wav->mp3), else stream wav
    if(format === 'mp3'){
      await new Promise((resolve, reject) => {
        const lame = spawn('lame', ['-V2', outWav, outMp3], {stdio:'ignore', shell:false});
        lame.on('error', (err)=> reject(err));
        lame.on('exit', (code) => {
          if(code === 0) resolve();
          else reject(new Error('lame failed with code ' + code));
        });
      });
      // send mp3
      res.setHeader('Content-Type','audio/mpeg');
      const stream = fs.createReadStream(outMp3);
      stream.pipe(res);
      stream.on('close', () => {
        // cleanup
        try{ fs.unlinkSync(outWav); fs.unlinkSync(outMp3);}catch(e){}
      });
    } else {
      // send wav
      res.setHeader('Content-Type','audio/wav');
      const stream = fs.createReadStream(outWav);
      stream.pipe(res);
      stream.on('close', () => {
        try{ fs.unlinkSync(outWav);}catch(e){}
      });
    }

  }catch(err){
    console.error('synthesis error', err);
    res.status(500).send('Synthesis failed: ' + (err && err.message ? err.message : String(err)));
  }
});

// serve static front-end (if deployed in same container)
app.use('/', express.static(path.join(__dirname, '..')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ADVAY TTS server listening on ${PORT}`));
