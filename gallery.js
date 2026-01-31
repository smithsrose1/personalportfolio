const audio = document.getElementById('audio-player');
const playPauseButton = document.getElementById('play-pause');
const volumeSlider = document.getElementById('volume');

const permissionScreen = document.getElementById('audio-permission-screen');
const enableAudioButton = document.getElementById('enable-audio-button');
const mainGallery = document.getElementById('main-gallery');


audio.volume = 0.5;


// ========== ARTWORK DATA ==========
const artworks = [
    {
        id: 1,
        title: "Starry Night",
        artist: "Vincent van Gogh",
        description: "A swirling night sky over a village, painted during Van Gogh's stay at the Saint-Paul-de-Mausole asylum in 1889.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg"
    },
    {
        id: 2,
        title: "The Great Wave",
        artist: "Katsushika Hokusai",
        description: "An iconic woodblock print depicting a towering wave threatening boats off the coast of Kanagawa.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Tsunami_by_hokusai_19th_century.jpg/1280px-Tsunami_by_hokusai_19th_century.jpg"
    },
    {
        id: 3,
        title: "Girl with a Pearl Earring",
        artist: "Johannes Vermeer",
        description: "Often called the 'Mona Lisa of the North,' this masterpiece captures a girl in an exotic dress with a large pearl earring.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/800px-1665_Girl_with_a_Pearl_Earring.jpg"
    },
    {
        id: 4,
        title: "The Persistence of Memory",
        artist: "Salvador Dalí",
        description: "Melting clocks in a dreamscape, this surrealist masterpiece explores the fluid nature of time and memory.",
        image: "https://upload.wikimedia.org/wikipedia/en/d/dd/The_Persistence_of_Memory.jpg"
    },
    {
        id: 5,
        title: "Water Lilies",
        artist: "Claude Monet",
        description: "Part of a series of approximately 250 oil paintings depicting Monet's flower garden at Giverny.",
        image: "https://upload.wikimedia.org/wikipedia/commons/a/aa/Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg"
    },
    {
        id: 6,
        title: "The Birth of Venus",
        artist: "Sandro Botticelli",
        description: "A Renaissance masterpiece depicting the goddess Venus emerging from the sea as a fully grown woman.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg/1280px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg"
    },
    {
        id: 7,
        title: "The Scream",
        artist: "Edvard Munch",
        description: "An expressionist icon showing an agonized figure against a tumultuous orange sky.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg/800px-Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg"
    },
    {
        id: 8,
        title: "American Gothic",
        artist: "Grant Wood",
        description: "A portrait of a farmer and his daughter standing before their house with a Gothic window.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Grant_Wood_-_American_Gothic_-_Google_Art_Project.jpg/800px-Grant_Wood_-_American_Gothic_-_Google_Art_Project.jpg"
    }
];

// ========== DOM ELEMENTS ==========
const track = document.getElementById('carousel-track');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modal-close');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalArtist = document.getElementById('modal-artist');
const modalDescription = document.getElementById('modal-description');
const infoTitle = document.getElementById('current-title');
const infoArtist = document.getElementById('current-artist');
const infoDisplay = document.querySelector('.info-display');

// ========== ENTER GALLERY ==========
enableAudioButton.addEventListener('click', () => {
    audio.play();

    permissionScreen.style.opacity = '0';
    permissionScreen.style.transition = 'opacity 0.5s';
    
    setTimeout(() => {
        permissionScreen.style.display = 'none';
        mainGallery.style.display = 'block';
        
        setTimeout(() => {
            mainGallery.style.opacity = '1';
            startCarousel();
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

// ========== BUILD CAROUSEL ==========
const ITEM_WIDTH = 220;
const totalWidth = artworks.length * ITEM_WIDTH;
const tripleArtworks = [...artworks, ...artworks, ...artworks];
const artworkElements = [];

tripleArtworks.forEach((art, index) => {
    const item = document.createElement('div');
    item.className = 'artwork-item';
    item.dataset.index = index % artworks.length;
    item.innerHTML = `
        <div class="frame">
            <img class="artwork-img" src="${art.image}" alt="${art.title}">
        </div>
    `;
    
    item.addEventListener('click', () => openModal(art));
    track.appendChild(item);
    artworkElements.push(item);
});

// ========== CAROUSEL ANIMATION ==========
let offset = 0;
let isPaused = false;
let animationId;
let lastTime = 0;
const speed = 60;

function getViewportCenter() {
    return window.innerWidth / 2;
}

function updateHighlights() {
    const center = getViewportCenter();
    const spotlightRadius = 200; // Increased for circular spotlight
    let closestIndex = -1;
    let closestDistance = Infinity;
    
    artworkElements.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        const itemCenter = rect.left + rect.width / 2;
        const distance = Math.abs(itemCenter - center);
        
        if (distance < spotlightRadius) {
            el.classList.add('highlighted');
            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = i;
            }
        } else {
            el.classList.remove('highlighted');
        }
    });
    
    if (closestIndex >= 0) {
        const artIndex = parseInt(artworkElements[closestIndex].dataset.index);
        infoTitle.textContent = artworks[artIndex].title;
        infoArtist.textContent = artworks[artIndex].artist;
        infoDisplay.classList.add('visible');
    } else {
        infoDisplay.classList.remove('visible');
    }
}

function animate(currentTime) {
    if (isPaused) {
        lastTime = 0;
        return;
    }
    
    if (!lastTime) lastTime = currentTime;
    const delta = currentTime - lastTime;
    lastTime = currentTime;
    
    offset += (speed * delta) / 1000;
    
    if (offset >= totalWidth) {
        offset -= totalWidth;
    }
    
    // Center the carousel properly
    const centerOffset = getViewportCenter() - 90; // Half of artwork width (180/2)
    track.style.transform = `translateX(${-offset + centerOffset}px)`;
    updateHighlights();
    
    animationId = requestAnimationFrame(animate);
}

function startCarousel() {
    if (!isPaused) {
        animationId = requestAnimationFrame(animate);
    }
}

function stopCarousel() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
}

// ========== MODAL ==========
function openModal(art) {
    isPaused = true;
    stopCarousel();
    
    modalImage.src = art.image;
    modalTitle.textContent = art.title;
    modalArtist.textContent = art.artist;
    modalDescription.textContent = art.description;
    
    modal.classList.add('active');
}

function closeModal() {
    modal.classList.remove('active');
    isPaused = false;
    lastTime = 0;
    startCarousel();
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});