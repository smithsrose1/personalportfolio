const audio = document.getElementById('audio-player');
const playPauseButton = document.getElementById('play-pause');
const volumeSlider = document.getElementById('volume');

const permissionScreen = document.getElementById('audio-permission-screen');
const enableAudioButton = document.getElementById('enable-audio-button');
const mainGallery = document.getElementById('main-gallery');


audio.volume = 0.5;

enableAudioButton.addEventListener('click', () => {
    audio.play();

    permissionScreen.style.display = 'none';
    permissionScreen.style.transition = 'opacity 0.5s';

    setTimeout(() => {
        permissionScreen.style.display = 'none';
    }, 500);

    mainGallery.style.display = 'block';
    playPauseButton.textContent = '⏸️';
});



