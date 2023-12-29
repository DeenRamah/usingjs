const recognizer = new webkitSpeechRecognition(); // Voice recognition object
recognizer.lang = 'en-US'; // Language model, you can change this
recognizer.interimResults = false; // Do not allow partial results
recognizer.maxAlternatives = 1; // There will only be one correct result

// Event listener for voice recognition
recognizer.addEventListener('result', (event) => {
 const transcript = event.results[0][0].transcript; // Voice recognition result
 translate(transcript); // Call the translation function
});

// Voice recognition start
recognizer.start();

// Translation function
function translate(text) {
 const language = 'en'; // Desired translation language

 fetch(`https://translation.googleapis.com/language/translate/v2?key=YOUR_API_KEY&target=${language}&q=${encodeURIComponent(text)}`)
    .then((response) => response.json())
    .then((data) => {
      const translation = data.data.translations[0].translatedText; // Translated text
      console.log('Translation:', translation);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}