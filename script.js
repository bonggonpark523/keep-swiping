
document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app-container');
    const instruction = document.querySelector('.instruction');

    let touchStartX = 0;
    let touchEndX = 0;
    let isSwiping = false;

    // Minimum distance for a swipe to be registered
    const minSwipeDistance = 50;

    // Sound setup
    const synth = window.speechSynthesis;
    let voices = [];

    function populateVoices() {
        voices = synth.getVoices();
    }

    populateVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = populateVoices;
    }

    function speak(text) {
        // Cancel any previous speech to ensure immediate response
        synth.cancel();

        const utterThis = new SpeechSynthesisUtterance(text);

        // Try to find a French male voice
        // Common male French voice names/IDs often contain 'Thomas', 'Nicolas', 'Google', or just generic 'fr-FR' often defaults to female on some systems so we try to be specific if possible or iterate.
        // Note: Voice implementation is browser/OS dependent. 
        const frVoices = voices.filter(voice => voice.lang.includes('fr'));

        // Prioritize known male voices or voices that might be male based on heuristical naming if available
        // 'Thomas' is a common male voice on Apple, 'Nicolas' on others. 'Google Français' is often male or neutral.
        const maleVoice = frVoices.find(voice =>
            voice.name.toLowerCase().includes('thomas') ||
            voice.name.toLowerCase().includes('nicolas') ||
            voice.name.toLowerCase().includes('cyril') ||
            (voice.name.toLowerCase().includes('google') && !voice.name.toLowerCase().includes('yaoyao')) // Google sometimes has specific names
        );

        if (maleVoice) {
            utterThis.voice = maleVoice;
        } else if (frVoices.length > 0) {
            // Fallback to the first available French voice if no specific male voice is found
            utterThis.voice = frVoices[0];
        } else {
            utterThis.lang = 'fr-FR';
        }

        // Lower pitch slightly can sometimes make a geometric voice sound more masculine if a specific male voice isn't found
        if (!maleVoice) {
            utterThis.pitch = 0.8;
        } else {
            utterThis.pitch = 1;
        }

        utterThis.rate = 1;

        synth.speak(utterThis);
    }

    // Touch Event Listeners
    appContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        isSwiping = true;
        document.body.classList.add('active');
    }, { passive: false });

    appContainer.addEventListener('touchend', (e) => {
        if (!isSwiping) return;

        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();

        isSwiping = false;
        document.body.classList.remove('active');
        document.body.classList.remove('swiping-left', 'swiping-right');
    }, { passive: false });

    // Optional: Add visual feedback during swipe (touchmove) if desired, 
    // but the main logic is on touchend for direction determination.
    // For immediate visual feedback:
    appContainer.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;

        const currentX = e.changedTouches[0].screenX;
        const diff = currentX - touchStartX;

        if (Math.abs(diff) > 20) { // Slight threshold for visual noise
            if (diff > 0) {
                document.body.classList.add('swiping-right');
                document.body.classList.remove('swiping-left');
            } else {
                document.body.classList.add('swiping-left');
                document.body.classList.remove('swiping-right');
            }
        }
    }, { passive: false });

    function handleSwipe() {
        const swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) < minSwipeDistance) {
            return; // Not a valid swipe
        }

        if (swipeDistance > 0) {
            // Swiped Right (Left to Right)
            // "coucou ma belle"
            console.log('Swiped Right');
            speak("coucou ma belle");
        } else {
            // Swiped Left (Right to Left)
            // "une salope"
            console.log('Swiped Left');
            speak("une salope");
        }
    }

    // Privacy: No logging or storage of any kind is implemented here.
    // The console.log is for debugging purposes during development and is ephemeral.
});
