const fs = require('fs');
const { exec } = require('child_process');
const speech = require('@google-cloud/speech');
const { TranslationServiceClient } = require('@google-cloud/translate').v2;

const recordingFile = 'recording.wav';
const recognizedTextFile = 'recognized.txt';

const speechClient = new speech.SpeechClient();
const translationClient = new TranslationServiceClient();

const languages = [
    'en-US', // English
    'fr-FR', // French
    'it-IT', // Italian
    'hi-IN', // Hindi
    'es-ES', // Spanish
    'ar',    // Arabic
    'arc',   // Aramaic
    'ur-PK', // Urdu
    'ha',    // Hausa
    'pt-PT', // Portuguese
];

async function recordAndRecognizeSpeech(languageCode) {
    const recordingConfig = {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: languageCode,
    };

    const audio = {
        content: fs.readFileSync(recordingFile).toString('base64'),
    };

    const request = {
        config: recordingConfig,
        audio: audio,
    };

    try {
        const [response] = await speechClient.recognize(request);
        const transcription = response.results.map(result => result.alternatives[0].transcript).join('\n');
        console.log(`Language: ${languageCode}`);
        console.log(`Transcription: ${transcription}`);

        // Write the recognized text to a file
        fs.writeFileSync(recognizedTextFile, transcription);

        // Translate the recognized text
        await translateText(transcription, languageCode);
    } catch (error) {
        console.error('Error during speech recognition:', error);
    }
}

async function translateText(text, sourceLanguage) {
    for (const targetLanguage of languages) {
        const [response] = await translationClient.translateText({
            parent: translationClient.locationPath('your-project-id', 'global'),
            contents: [text],
            mimeType: 'text/plain',
            sourceLanguageCode: sourceLanguage,
            targetLanguageCode: targetLanguage,
        });

        const translatedText = response.translations[0].translatedText;
        console.log(`Translated (${targetLanguage}): ${translatedText}`);
    }
}

function main() {
    // You need to record audio and save it as a WAV file (recording.wav) before running this script.

    // Example: Use SoX (Sound eXchange) to record audio in the command line:
    // exec('rec -r 16000 -b 16 -c 1 recording.wav', (error, stdout, stderr) => {
    //     if (error) {
    //         console.error(`Error during recording: ${error.message}`);
    //         return;
    //     }
    //     console.log(`Recording completed: ${stdout}`);
    //     languages.forEach(language => recordAndRecognizeSpeech(language));
    // });

    // Uncomment the above code to record audio using SoX. Make sure to install SoX first.
}

main();
