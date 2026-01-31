
const logoButton = document.getElementById('logo-button');


const playAudio = document.getElementById('play-sound');
const audio = document.getElementById('pronounce-player');
audio.loop = true; 
audio.volume = 0.05;

logoButton.addEventListener('click', () => {
    
});

playAudio.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
});
