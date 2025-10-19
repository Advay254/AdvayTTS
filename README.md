# Advanced Text-to-Speech Website

A production-ready TTS website using Coqui TTS with advanced voice customization features.

## Features

- Multiple voice genders (Male, Female, Neutral)
- Age-based voice selection (5-60 years)
- Emotional tones with intensity control
- Multiple voice types and accents
- Modern, responsive UI
- REST API for integration
- SEO optimized

## Deployment

### Render.com (Free Tier)

1. Fork this repository
2. Connect your GitHub account to Render
3. Create a new Web Service
4. Connect your forked repository
5. Use the following settings:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app --bind 0.0.0.0:$PORT`

### Local Development

1. Clone the repository
2. Install dependencies: `pip install -r requirements.txt`
3. Run: `python app.py`
4. Visit: `http://localhost:5000`

## API Usage

```bash
curl -X POST http://your-domain.com/api/synthesize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello world",
    "gender": "male",
    "age": 30,
    "tone": "normal",
    "intensity": 0.7,
    "voiceType": "Deep Voice",
    "accent": "US English"
  }' \
  --output speech.wav
