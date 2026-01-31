const audio = document.getElementById('audio-player');
const playPauseButton = document.getElementById('play-pause');
const volumeSlider = document.getElementById('volume');

const permissionScreen = document.getElementById('audio-permission-screen');
const enableAudioButton = document.getElementById('enable-audio-button');
const mainGallery = document.getElementById('main-gallery');


audio.volume = 0.5;

enableAudioButton.addEventListener('click', () => {
    audio.play();

    permissionScreen.style.opacity = '0';
    permissionScreen.style.transition = 'opacity 0.5s';

    setTimeout(() => {
        permissionScreen.style.display = 'none';

        mainGallery.style.display = 'block';
        mainGallery.style.opacity = '0';
        setTimeout(() => {
            mainGallery.style.transition = 'opacity 1s';
            mainGallery.style.opacity = '1';
        }, 50);

    }, 500);
    playPauseButton.textContent = '⏸️';
});

playPauseButton.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playPauseButton.textContent = '⏸️';
    } else {
        audio.pause();
        playPauseButton.textContent = '▶️';
    }
});

volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value / 100;
});