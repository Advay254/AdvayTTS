# 🎙️ ADVAY TTS (Text-To-Speech) Website

A modern, production-ready open-source **Text To Speech (TTS)** website built with **Flask + OpenTTS** (an open-source TTS engine).  
It allows users to select **voice gender, age, tone, intensity, custom voice types, and accents** before generating speech.

---

## 🌍 Key Features

✅ **Voice Options**
- Choose **Male** or **Female** voice.
- Set **age** of the voice (5 to 60 years old).
- Choose from **custom voice types** (based on available models).

✅ **Tone Control**
- Available tones:
  - Normal
  - Angry
  - Happy
  - Sad
  - Surprised
  - Fear
  - Playful
- Each tone supports **intensity levels** between `0.0` and `1.4`.

✅ **Accents**
Select from 10 most recognizable world accents:
1. Indian English  
2. Nigerian English  
3. British (UK)  
4. American (US)  
5. Australian  
6. Canadian  
7. South African  
8. Irish  
9. Filipino  
10. Kenyan English

✅ **HTTP API**
- You can generate speech through an HTTP request.  
- Example:

POST /api/tts { "text": "Hello world!", "gender": "female", "age": 25, "tone": "happy", "intensity": 1.0, "accent": "british" }

→ Returns a downloadable `.mp3` or `.wav` audio file.

✅ **Modern UI**
- Simple, modern, responsive design with clear layout.
- Professional feel but beginner-friendly.
- Footer credit: **"Created by ADVAY"**

✅ **SEO Friendly**
- Includes meta tags, schema data, and sitemap info for crawlers.
- Optimized for discoverability and page ranking.

✅ **Lightweight & Open Source**
- Uses **OpenTTS** (https://github.com/synesthesiam/opentts) or other free open-source TTS engines.
- No API key or subscription required.
- Works well on free hosting services like **Render**, **Koyeb**, **Vercel**, etc.

✅ **Future Upgradability**
- The structure allows easy addition of:
- Advertisements
- More voices
- New accents or tones
- Logging and analytics

---

## 🧩 Tech Stack

- **Backend:** Python (Flask)
- **Frontend:** HTML, CSS, JS
- **TTS Engine:** OpenTTS / Mimic3 (lightweight offline option)
- **Audio Output:** MP3 or WAV format

---

## 🚀 Local Setup

### 1️⃣ Clone the repository

git clone https://github.com/advay-ai/advay-tts.git cd advay-tts

### 2️⃣ Create a virtual environment

python -m venv venv source venv/bin/activate   # on Windows: venv\Scripts\activate

### 3️⃣ Install dependencies

pip install -r requirements.txt

### 4️⃣ Run the server

python app.py

### 5️⃣ Access your site
Visit `http://localhost:5000` to use the web interface.

---

## 🌐 API Usage Example (HTTP Request)

**POST** `/api/tts`

**Request Body:**
```json
{
  "text": "Welcome to ADVAY TTS!",
  "gender": "male",
  "age": 30,
  "tone": "playful",
  "intensity": 0.9,
  "accent": "nigerian"
}

Response:

Returns an MP3 audio file URL that you can play or download.



---

⚙️ Deployment on Free Hosts

You can easily deploy it to:

Render.com

Koyeb.com

Vercel.com

Railway.app

Fly.io


Steps:

1. Push your repo to GitHub.


2. Connect your hosting service to the repo.


3. Set Python as the environment and run python app.py.




---

🧠 Notes

OpenTTS supports multiple engines (like Mimic3, eSpeak, MaryTTS, and others).

Voice tone and intensity are applied using simple pitch, rate, and timbre adjustments.

Accent presets can be mapped to language variants (e.g., en-IN for Indian English).



---

👣 Folder Structure

advay-tts/
│
├── app.py                 # Flask main server
├── static/                # CSS, JS, icons
├── templates/             # HTML pages
├── voices/                # Pre-configured custom voices
├── requirements.txt
└── README.txt


---

📢 Footer

> Created by ADVAY




---

📄 License

Open Source – MIT License.

---
