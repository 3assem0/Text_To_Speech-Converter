// Select the textarea where users will input text, the select dropdown for voice options, and the button to trigger speech
const textarea = document.querySelector("textarea"), 
      voiceList = document.querySelector("select"),
      speechBtn = document.querySelector("button");

// Initialize the speech synthesis API and a flag to track speaking state
let synth = speechSynthesis, 
    isSpeaking = true;

// Call the voices function to populate the dropdown menu with available voices
voices();

function voices() {
    // Loop through all available voices from the browser's speech synthesis API
    for (let voice of synth.getVoices()) {
        // Set "Google US English" as the default selected voice
        let selected = voice.name === "Google US English" ? "selected" : "";
        // Create an option element with the voice name and language
        let option = `<option value="${voice.name}" ${selected}>${voice.name} (${voice.lang})</option>`;
        // Add the option to the dropdown menu
        voiceList.insertAdjacentHTML("beforeend", option);
    }
}

// Update the dropdown list when new voices are loaded (e.g., when the browser initializes them)
synth.addEventListener("voiceschanged", voices);

function textToSpeech(text) {
    // Create a new speech synthesis utterance with the given text
    let utterance = new SpeechSynthesisUtterance(text);
    // Loop through the available voices
    for (let voice of synth.getVoices()) {
        // Match the selected voice in the dropdown with the available voices
        if (voice.name === voiceList.value) {
            // Set the voice of the utterance
            utterance.voice = voice;
        }
    }
    // Use the speech synthesis API to speak the utterance
    synth.speak(utterance);
}

// Add a click event listener to the button
speechBtn.addEventListener("click", e => {
    e.preventDefault(); // Prevent default behavior of form submission

    // Check if the textarea is not empty
    if (textarea.value !== "") {
        // If not already speaking, start speaking the text
        if (!synth.speaking) {
            textToSpeech(textarea.value);
        }

        // If the input text is longer than 80 characters, handle pause and resume functionality
        if (textarea.value.length > 80) {
            // Check every 500ms if speaking has stopped
            setInterval(() => {
                if (!synth.speaking && !isSpeaking) {
                    isSpeaking = true; // Reset the speaking flag
                    speechBtn.innerText = "Convert To Speech"; // Update button text
                }
            }, 500);

            // Toggle between resume and pause when the button is clicked
            if (isSpeaking) {
                synth.resume(); // Resume speaking if paused
                isSpeaking = false; // Set the flag to indicate speech is active
                speechBtn.innerText = "Pause Speech"; // Update button text
            } else {
                synth.pause(); // Pause speaking
                isSpeaking = true; // Set the flag to indicate speech is paused
                speechBtn.innerText = "Resume Speech"; // Update button text
            }
        } else {
            // For short text, simply update the button text
            speechBtn.innerText = "Convert To Speech";
        }
    }
});
