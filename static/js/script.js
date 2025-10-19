class TTSApp {
    constructor() {
        this.voiceOptions = {};
        this.currentAudioUrl = null;
        this.init();
    }

    async init() {
        await this.loadVoiceOptions();
        this.setupEventListeners();
        this.updateCharacterCount();
    }

    async loadVoiceOptions() {
        try {
            const response = await fetch('/api/voices');
            this.voiceOptions = await response.json();
            this.populateSelectOptions();
        } catch (error) {
            console.error('Failed to load voice options:', error);
            this.showError('Failed to load voice options. Please refresh the page.');
        }
    }

    populateSelectOptions() {
        // Populate voice type options based on gender
        this.updateVoiceTypes();
        
        // Populate tone options
        const toneSelect = document.getElementById('toneSelect');
        toneSelect.innerHTML = this.voiceOptions.tones.map(tone => 
            `<option value="${tone}">${this.capitalizeFirst(tone)}</option>`
        ).join('');

        // Populate accent options
        const accentSelect = document.getElementById('accentSelect');
        accentSelect.innerHTML = this.voiceOptions.accents.map(accent => 
            `<option value="${accent}">${accent}</option>`
        ).join('');
    }

    updateVoiceTypes() {
        const genderSelect = document.getElementById('genderSelect');
        const voiceTypeSelect = document.getElementById('voiceTypeSelect');
        const selectedGender = genderSelect.value;

        const voices = this.voiceOptions.voices[selectedGender] || [];
        voiceTypeSelect.innerHTML = voices.map(voice => 
            `<option value="${voice}">${voice}</option>`
        ).join('');
    }

    setupEventListeners() {
        // Text input
        document.getElementById('textInput').addEventListener('input', () => {
            this.updateCharacterCount();
        });

        // Gender selection
        document.getElementById('genderSelect').addEventListener('change', () => {
            this.updateVoiceTypes();
        });

        // Age slider
        document.getElementById('ageSelect').addEventListener('input', (e) => {
            document.getElementById('ageValue').textContent = e.target.value;
        });

        // Intensity slider
        document.getElementById('intensitySelect').addEventListener('input', (e) => {
            document.getElementById('intensityValue').textContent = e.target.value;
        });

        // Generate button
        document.getElementById('generateBtn').addEventListener('click', () => {
            this.generateSpeech();
        });

        // Download button
        document.getElementById('downloadBtn').addEventListener('click', () => {
            this.downloadAudio();
        });
    }

    updateCharacterCount() {
        const textInput = document.getElementById('textInput');
        const charCount = document.getElementById('charCount');
        charCount.textContent = textInput.value.length;
    }

    async generateSpeech() {
        const textInput = document.getElementById('textInput');
        const text = textInput.value.trim();

        if (!text) {
            this.showError('Please enter some text to convert to speech.');
            return;
        }

        if (text.length > 5000) {
            this.showError('Text is too long. Maximum 5000 characters allowed.');
            return;
        }

        const requestData = {
            text: text,
            gender: document.getElementById('genderSelect').value,
            age: parseInt(document.getElementById('ageSelect').value),
            tone: document.getElementById('toneSelect').value,
            intensity: parseFloat(document.getElementById('intensitySelect').value),
            voiceType: document.getElementById('voiceTypeSelect').value,
            accent: document.getElementById('accentSelect').value
        };

        this.setLoading(true);

        try {
            const response = await fetch('/api/synthesize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate speech');
            }

            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            
            this.playGeneratedAudio(audioUrl);
            this.showSuccess('Speech generated successfully!');
            
        } catch (error) {
            console.error('Speech generation error:', error);
            this.showError(error.message || 'Failed to generate speech. Please try again.');
        } finally {
            this.setLoading(false);
        }
    }

    playGeneratedAudio(audioUrl) {
        // Clean up previous audio URL
        if (this.currentAudioUrl) {
            URL.revokeObjectURL(this.currentAudioUrl);
        }

        this.currentAudioUrl = audioUrl;
        
        const audioElement = document.getElementById('audioElement');
        const audioPlayer = document.getElementById('audioPlayer');
        
        audioElement.src = audioUrl;
        audioPlayer.style.display = 'block';
        
        // Scroll to audio player
        audioPlayer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    downloadAudio() {
        if (!this.currentAudioUrl) return;

        const a = document.createElement('a');
        a.href = this.currentAudioUrl;
        a.download = 'generated_speech.wav';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    setLoading(loading) {
        const generateBtn = document.getElementById('generateBtn');
        const btnText = generateBtn.querySelector('.btn-text');
        const spinner = generateBtn.querySelector('.loading-spinner');

        if (loading) {
            generateBtn.disabled = true;
            btnText.textContent = 'Generating...';
            spinner.style.display = 'block';
        } else {
            generateBtn.disabled = false;
            btnText.textContent = 'Generate Speech';
            spinner.style.display = 'none';
        }
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.error-message, .success-message');
        existingMessages.forEach(msg => msg.remove());

        const messageDiv = document.createElement('div');
        messageDiv.className = type === 'error' ? 'error-message' : 'success-message';
        messageDiv.textContent = message;

        const actionSection = document.querySelector('.action-section');
        actionSection.insertBefore(messageDiv, actionSection.firstChild);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }

    capitalizeFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TTSApp();
});

// Add SEO meta tags dynamically
document.addEventListener('DOMContentLoaded', () => {
    // Add structured data for SEO
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Advanced Text-to-Speech Generator",
        "description": "Professional Text-to-Speech service with multiple voices, emotions, accents, and customization options",
        "provider": {
            "@type": "Organization",
            "name": "ADVAY"
        },
        "areaServed": "Worldwide",
        "availableLanguage": ["English"],
        "serviceType": "Text-to-Speech"
    });
    document.head.appendChild(script);
});
