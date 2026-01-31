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
        title: "Steve and Kira",
        artist: "Smita Rosemary",
        description: "A portrait of my brother Steve and his wife Kira.",
        size: "16' x 20', acrylic on canvas panel",
        image: "assets/artwork1.jpeg"
    },
    {
        id: 2,
        title: "Elana",
        artist: "Smita Rosemary",
        description: "First commission. Special thanks to my SIL's mom <3. Happy Birthday Elana.",
        size: "20' x 24', acrylic on canvas",
        image: "assets/artwork2.jpeg"
    },
    {
        id: 3,
        title: "In the Smoke",
        artist: "Smita Rosemary",
        description: "Caught up in the smoke.",
        size: "8' x 10', prismacolor on paper",
        image: "assets/art3.jpeg"
    },
    {
        id: 4,
        title: "Dream",
        artist: "Smita Rosemary",
        description: "In this dreamscape, this piece explores a colorful state only found in dreams.",
        size: "16' x 20', acrylic on canvas panel",
        image: "assets/art4.jpeg"
    },
    {
        id: 5,
        title: "Stew",
        artist: "Smita Rosemary",
        description: "Part of a series of portraits of my brother, Steve. His nickname is Chicken Stew.",
        size: "5' x 5', prismacolor on paper",
        image: "assets/art5.jpeg"
    },
    {
        id: 6,
        title: "Koi Pond",
        artist: "Smita Rosemary",
        description: "Koi with water lilies..",
        size: "10' x 12', acrylic on wood panel",
        image: "assets/art7.jpeg"
    },
    {
        id: 7,
        title: "Burnt Out",
        artist: "Smita Rosemary",
        description: "A self portrait during the days of covid-19.",
        size: "16' x 20', acrylic on wood panel",
        image: "assets/art8.jpeg"
    },
    {
        id: 8,
        title: "Sushi and Friends",
        artist: "Smita Rosemary",
        description: "The last hang out with friends before the pandemic lockdowns.",
        size: "10' x 12', watercolor on paper",
        image: "assets/art9.jpeg"
    }
    ,
    {
        id: 9,
        title: "Cradled",
        artist: "Smita Rosemary",
        description: "Mothers swaddling their children with whatever they can.",
        size: "12' x 16', acrylic on wood panel",
        image: "assets/art10.jpeg"
    }
    ,
    {
        id: 10,
        title: "Another Chicken",
        artist: "Smita Rosemary",
        description: "Part two of the series.",
        size: "5' x 5', prismacolor on paper",
        image: "assets/art6.jpeg"
    },
    {
        id: 11,
        title: "Devotion",
        artist: "Smita Rosemary",
        description: "A portrait of a woman with one devotion.",
        size: "16' x 20', acrylic on canvas panel",
        image: "assets/art11.jpeg"
    }
    ,
    {
        id: 12,
        title: "Faceless Mothers",
        artist: "Smita Rosemary",
        description: "A mother and her child, faceless due to the loss of identity in motherhood.",
        size: "20' x 24', acrylic on canvas",
        image: "assets/art12.jpeg"
    }
    ,
    {
        id: 13,
        title: "Self Portrait - 8th Grade",
        artist: "Smita Rosemary",
        description: "A self portrait from 8th grade.",
        size: "10' x 18', prismacolor on paper",
        image: "assets/art13.jpeg"
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
const modalSize = document.getElementById('modal-size');
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
const GAP = 40; // Gap between items from CSS
const IMAGE_WIDTH = 180; // Width of artwork image
const FRAME_PADDING = 28; // Frame padding (14px * 2)
const ITEM_WIDTH = IMAGE_WIDTH + FRAME_PADDING + GAP; // Total width including gap
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
let offset = totalWidth; // Start at the middle set of artworks
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
    
    // Seamless infinite loop - reset when we've scrolled through one complete set
    if (offset >= totalWidth * 2) {
        offset -= totalWidth;
    } else if (offset < totalWidth) {
        offset += totalWidth;
    }
    
    // Center the carousel properly
    const centerOffset = getViewportCenter() - (IMAGE_WIDTH + FRAME_PADDING) / 2;
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
    modalSize.textContent = art.size;
    
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