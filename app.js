/* 
  ===========================================
  PREMIUM BIRTHDAY WEBSITE - APP JS
  ===========================================
*/

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// --- State Management & Navigation ---
const pages = {
    landing: document.getElementById('page-landing'),
    loader: document.getElementById('page-loader'),
    gallery: document.getElementById('page-gallery'),
    letter: document.getElementById('page-letter'),
    reasons: document.getElementById('page-reasons'),
    music: document.getElementById('page-music'),
    heart: document.getElementById('page-heart'),
    gift: document.getElementById('page-gift')
};

function transitionToPage(fromPage, toPage, callback) {
    gsap.to(fromPage, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
            fromPage.classList.add('hidden');
            fromPage.classList.remove('active');
            
            toPage.classList.remove('hidden');
            
            gsap.fromTo(toPage, 
                { opacity: 0 }, 
                { opacity: 1, duration: 0.8, ease: "power2.inOut", onComplete: () => {
                    toPage.classList.add('active');
                    if (callback) callback();
                }}
            );
        }
    });
}

// --- Page 1: Landing ---
document.getElementById('btn-begin').addEventListener('click', () => {
    transitionToPage(pages.landing, pages.loader, runMemoryLoader);
});

// Intro Animation
gsap.fromTo(".title-main", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: "power3.out", delay: 0.5 });
gsap.fromTo(".title-sub", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: "power3.out", delay: 1 });
gsap.fromTo(".landing-subtitle", { opacity: 0 }, { opacity: 1, duration: 1.5, ease: "power3.out", delay: 2 });
gsap.fromTo("#btn-begin", { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: "back.out(1.7)", delay: 2.5 });

// Parallax for Landing
document.addEventListener('mousemove', (e) => {
    if(pages.landing.classList.contains('active')) {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        gsap.to(".landing-content", { x: x, y: y, duration: 1, ease: "power2.out" });
    }
});


// --- Page 2: Memory Loader ---
function runMemoryLoader() {
    const texts = [
        "Finding our memories...",
        "Replaying laughter...",
        "Counting hugs...",
        "Loading happiness...",
        "Almost there...",
        "Welcome ❤️"
    ];
    const textEl = document.getElementById('progress-text');
    const barEl = document.getElementById('progress-bar');
    
    let progress = 0;
    let textIndex = 0;
    
    const interval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if(progress > 100) progress = 100;
        
        barEl.style.width = `${progress}%`;
        
        if (progress > (textIndex + 1) * (100 / texts.length) && textIndex < texts.length - 1) {
            textIndex++;
            gsap.to(textEl, { opacity: 0, duration: 0.2, onComplete: () => {
                textEl.innerText = texts[textIndex];
                gsap.to(textEl, { opacity: 1, duration: 0.2 });
            }});
        }
        
        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                transitionToPage(pages.loader, pages.gift);
            }, 1000);
        }
    }, 400);
}

document.getElementById('btn-to-gallery').addEventListener('click', () => {
    transitionToPage(pages.gift, pages.gallery, initGalleryAnimations);
});

// --- Page 4: Memory Gallery ---
const galleryItemsData = [
    { src: 'assets/gallery-1.jpeg', type: 'image' },
    { src: 'assets/gallery-2.jpeg', type: 'image' },
    { src: 'assets/gallery-3.jpeg', type: 'image' },
    { src: 'assets/gallery-4.jpeg', type: 'image' },
    { src: 'assets/gallery-5.jpeg', type: 'image' },
    { src: 'assets/gallery-6.jpeg', type: 'image' },
    { src: 'assets/gallery-7.jpeg', type: 'image' },
    { src: 'assets/gallery-8.jpeg', type: 'image' },
    { src: 'assets/gallery-9.jpeg', type: 'image' },
    { src: 'assets/gallery-10.jpeg', type: 'image' },
    { src: 'assets/gallery-11.jpeg', type: 'image' },
    { src: 'assets/gallery-12.jpeg', type: 'image' },
    { src: 'assets/gallery-13.jpeg', type: 'image' },
    { src: 'assets/gallery-14.jpeg', type: 'image' },
    { src: 'assets/gallery-15.jpeg', type: 'image' },
    { src: 'assets/gallery-16.jpeg', type: 'image' },
    { src: 'assets/gallery-17.jpeg', type: 'image' },
    { src: 'assets/gallery-18.mp4', type: 'video' },
    { src: 'assets/gallery-19.mp4', type: 'video' },
    { src: 'assets/gallery-20.jpeg', type: 'image' }
];

function renderGallery() {
    const container = document.getElementById('masonry-gallery');
    if(container.children.length > 0) return; // Prevent re-rendering

    galleryItemsData.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        
        // Make gallery-12 special
        if (item.src.includes('gallery-12')) {
            div.classList.add('special-item');
        }

        let mediaEl;
        if (item.type === 'video') {
            mediaEl = document.createElement('video');
            mediaEl.src = item.src;
            mediaEl.autoplay = true;
            mediaEl.muted = true;
            mediaEl.loop = true;
            mediaEl.playsInline = true;
        } else {
            mediaEl = document.createElement('img');
            mediaEl.src = item.src;
        }
        
        mediaEl.className = `image-placeholder`;
        mediaEl.alt = 'Memory';
        
        div.appendChild(mediaEl);
        container.appendChild(div);
        
        mediaEl.addEventListener('click', () => {
            currentImageIndex = index;
            lightbox.classList.add('active');
            updateLightboxMedia();
        });
    });
}

function initGalleryAnimations() {
    renderGallery();
    const items = document.querySelectorAll('.gallery-item');
    gsap.fromTo(items, { opacity: 0, y: 50 }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".masonry-gallery",
            start: "top 85%",
            scroller: pages.gallery
        }
    });
}

// Lightbox Logic
const lightbox = document.getElementById('lightbox');
const lightboxImgContainer = document.getElementById('lightbox-img-container');
let currentImageIndex = 0;

function updateLightboxMedia() {
    lightboxImgContainer.innerHTML = '';
    const item = galleryItemsData[currentImageIndex];
    
    if (item.type === 'video') {
        const video = document.createElement('video');
        video.src = item.src;
        video.controls = true;
        video.autoplay = true;
        video.className = 'image-placeholder lightbox-img';
        lightboxImgContainer.appendChild(video);
    } else {
        const img = document.createElement('img');
        img.src = item.src;
        img.className = 'image-placeholder lightbox-img';
        lightboxImgContainer.appendChild(img);
    }

    const captionEl = document.getElementById('lightbox-caption');
    if (captionEl) {
        if (item.src.includes('gallery-12')) {
            captionEl.innerText = "look how smol you are hehe";
            captionEl.style.display = "block";
        } else {
            captionEl.style.display = "none";
        }
    }
}

document.getElementById('lightbox-close').addEventListener('click', () => {
    lightbox.classList.remove('active');
    lightboxImgContainer.innerHTML = ''; // Stop video playback
});

document.getElementById('lightbox-next').addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % galleryItemsData.length;
    updateLightboxMedia();
});

document.getElementById('lightbox-prev').addEventListener('click', () => {
    currentImageIndex = (currentImageIndex - 1 + galleryItemsData.length) % galleryItemsData.length;
    updateLightboxMedia();
});

document.getElementById('btn-to-letter').addEventListener('click', () => {
    transitionToPage(pages.gallery, pages.letter, runTypewriter);
});


// --- Page 5: Love Letter ---
const letterText = `Dear Love,\n\nToday isn't just another birthday.\n\nIt's the celebration of the person who changed my world.\n\nEvery moment with you is a treasure.\nYour smile lights up my darkest days.\n\nHappy Birthday.\n\nI love you forever.`;

function runTypewriter() {
    const container = document.getElementById('typewriter-text');
    const signature = document.getElementById('letter-signature');
    const btnNext = document.getElementById('btn-to-reasons');
    container.innerHTML = '';
    signature.classList.remove('visible');
    btnNext.classList.add('hidden');
    
    let i = 0;
    function typeChar() {
        if (i < letterText.length) {
            const char = letterText.charAt(i);
            if (char === '\n') {
                container.appendChild(document.createElement('br'));
            } else {
                container.appendChild(document.createTextNode(char));
            }
            
            // Pause at punctuation
            let delay = 50;
            if (['.', ',', '!'].includes(char)) delay = 400;
            if (char === '\n') delay = 200;
            
            i++;
            setTimeout(typeChar, delay);
        } else {
            setTimeout(() => {
                signature.classList.add('visible');
                setTimeout(() => {
                    btnNext.classList.remove('hidden');
                    gsap.fromTo(btnNext, {opacity:0, y:20}, {opacity:1, y:0, duration: 1});
                }, 1000);
            }, 500);
        }
    }
    setTimeout(typeChar, 1000);
}

document.getElementById('btn-to-reasons').addEventListener('click', () => {
    transitionToPage(pages.letter, pages.reasons);
});


// --- Page 6: Reasons I Love You ---
const reasonsList = [
    "Your beautiful smile.",
    "The way your eyes light up when you're happy.",
    "Your endless kindness to everyone around you.",
    "How you always know exactly what to say to make me feel better.",
    "The sound of your laugh.",
    "I love you more than I love Barcelona.",
    "The way you support my wildest dreams.",
    "How you make ordinary days feel like adventures.",
    "Your incredible sense of humor.",
    "The way you look at me.",
    "I love you more than I love Messi.",
    "Your unwavering belief in me.",
    "The way you hold my hand.",
    "How safe I feel when I'm with you.",
    "Your passion for the things you care about.",
    "The way you inspire me to be a better person.",
    "Your gentle touch.",
    "How you remember the little details about me.",
    "The way you smell.",
    "Your intelligence and the way your mind works.",
    "I love you even more than Argentina winning the World Cup.",
    "The way you forgive easily.",
    "Your beautiful soul.",
    "How comfortable we are in silence together.",
    "The way you challenge me.",
    "Your adventurous spirit.",
    "How much you care for your family.",
    "The cute faces you make without realizing it.",
    "Your resilience and strength.",
    "The way you embrace my flaws.",
    "How you always try to see the best in people.",
    "The sound of your voice.",
    "Your warmth and affection.",
    "How naturally we fit together.",
    "Your honesty and authenticity.",
    "The way you make me laugh until my sides hurt.",
    "Your beautiful hair.",
    "How you always know when I need a hug.",
    "The way you listen to me.",
    "Your incredible patience.",
    "How you make me feel like the luckiest person in the world.",
    "Your creativity.",
    "The way you treat others with respect.",
    "Your ambition and drive.",
    "How you turn my bad days around.",
    "The way you handle challenges.",
    "Your generous heart.",
    "How you make the world a brighter place.",
    "The way you dance when you're happy.",
    "Your unique perspective on life.",
    "How you always encourage me.",
    "The way you make me feel understood.",
    "Your loyalty and devotion.",
    "How you celebrate my successes.",
    "The way you comfort me when I'm sad.",
    "Your beautiful, radiant energy.",
    "How you always make time for me.",
    "The way you trust me completely.",
    "Your grace and elegance.",
    "How you bring out the best in me.",
    "The way you appreciate the small things.",
    "Your deep empathy.",
    "How you make me feel invincible.",
    "The way you look in the morning.",
    "Your thoughtfulness.",
    "How you always keep your promises.",
    "The way you make every moment memorable.",
    "Your unshakeable confidence.",
    "How you let me be myself around you.",
    "The way you look at the world.",
    "Your beautiful, kind eyes.",
    "How you surprise me in the best ways.",
    "The way you love me unconditionally.",
    "Your ability to make everything okay.",
    "How you are my safe haven.",
    "The way you show your love through actions.",
    "Your playful nature.",
    "How you understand my silences.",
    "The way you make my heart skip a beat.",
    "Your fierce independence.",
    "How you always stand by my side.",
    "The way you make me want to grow.",
    "Your radiant positivity.",
    "How you respect our differences.",
    "The way you make me feel at home.",
    "Your gentle, calming presence.",
    "How you always believe the best is yet to come.",
    "The way you share your dreams with me.",
    "Your incredible inner beauty.",
    "How you make me feel cherished.",
    "The way you light up any room you walk into.",
    "Your compassionate soul.",
    "How you are my greatest adventure.",
    "The way you make loving you so easy.",
    "Your brilliant mind.",
    "How you are my best friend.",
    "The way you make me believe in soulmates.",
    "Your soft, sweet kisses.",
    "How you are the best thing that ever happened to me.",
    "The way I just know, without a doubt, that you are the one."
];
let currentReason = 0;
const reasonCard = document.getElementById('reason-card');
const reasonFront = document.getElementById('reason-text-front');
const reasonBack = document.getElementById('reason-text-back');
const reasonCounter = document.getElementById('reason-current');

reasonCard.addEventListener('click', () => {
    if (currentReason >= reasonsList.length) return; // Prevent going over
    
    reasonCard.classList.toggle('is-flipped');
    
    if (reasonCard.classList.contains('is-flipped')) {
        reasonBack.innerText = reasonsList[currentReason];
        currentReason++;
        reasonCounter.innerText = currentReason;
    } else {
        if (currentReason < reasonsList.length) {
            reasonFront.innerText = reasonsList[currentReason];
            currentReason++;
            reasonCounter.innerText = currentReason;
        } else {
            reasonFront.innerText = "You are my everything.";
        }
    }
});

document.getElementById('btn-to-music').addEventListener('click', () => {
    transitionToPage(pages.reasons, pages.music);
});


// --- Page 9: Music ---
const vinyl = document.getElementById('vinyl');
const bgMusic = document.getElementById('bg-music');
let isPlaying = false;

vinyl.addEventListener('click', () => {
    isPlaying = !isPlaying;
    if (isPlaying) {
        vinyl.classList.add('playing');
        if (bgMusic) bgMusic.play().catch(e => console.log("Audio play failed:", e));
    } else {
        vinyl.classList.remove('playing');
        if (bgMusic) bgMusic.pause();
    }
});

document.getElementById('btn-to-heart').addEventListener('click', () => {
    if(isPlaying) vinyl.click(); // Pause music when leaving
    transitionToPage(pages.music, pages.heart);
});


// --- Page 10: Interactive Heart ---
const heartBtn = document.getElementById('heart-btn');
const loveLevel = document.getElementById('love-level');
const glassHeart = document.querySelector('.glass-heart');
const finalMessage = document.getElementById('final-message');
let clicks = 0;

heartBtn.addEventListener('click', () => {
    if (clicks >= 100) return;
    
    clicks++;
    loveLevel.innerText = `${clicks}%`;
    
    // Heart grows
    const scale = 1 + (clicks * 0.015);
    gsap.to(glassHeart, { scale: scale, duration: 0.3, ease: "back.out(2)" });
    
    // Create mini particle hearts on click
    createMiniHeart(event.clientX, event.clientY);
    
    // Background changes
    if (clicks === 25) window.changeBackgroundGradient(1);
    if (clicks === 50) window.changeBackgroundGradient(2);
    if (clicks === 75) window.changeBackgroundGradient(3);
    if (clicks === 90) window.changeBackgroundGradient(4);
    
    // Climax
    if (clicks === 100) {
        triggerClimax();
    }
});

function createMiniHeart(x, y) {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.position = 'fixed';
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.fontSize = '24px';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '50';
    document.body.appendChild(heart);
    
    gsap.to(heart, {
        y: y - 100 - Math.random() * 100,
        x: x + (Math.random() - 0.5) * 100,
        opacity: 0,
        rotation: (Math.random() - 0.5) * 60,
        duration: 1 + Math.random(),
        onComplete: () => heart.remove()
    });
}

function triggerClimax() {
    // Hide counter and heart container
    gsap.to([heartBtn, '.love-counter'], { opacity: 0, duration: 1, display: 'none' });
    
    // Show Final Message
    finalMessage.classList.remove('hidden');
    gsap.fromTo(finalMessage, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 2, delay: 1, ease: "power2.out" });
    
    // Confetti
    const duration = 15 * 1000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#FADADD', '#E6B8A2', '#ffffff']
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#FADADD', '#E6B8A2', '#ffffff']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

document.getElementById('btn-replay').addEventListener('click', () => {
    // Reset state and go to page 1
    clicks = 0;
    loveLevel.innerText = '1%';
    window.changeBackgroundGradient(0);
    gsap.to(glassHeart, { scale: 1, duration: 0.5 });
    finalMessage.classList.add('hidden');
    
    heartBtn.style.opacity = 1;
    heartBtn.style.display = 'block';
    document.querySelector('.love-counter').style.opacity = 1;
    document.querySelector('.love-counter').style.display = 'block';
    
    transitionToPage(pages.heart, pages.landing);
});


// --- Go Back Logic ---
document.getElementById('back-from-gift').addEventListener('click', () => { transitionToPage(pages.gift, pages.landing); });
document.getElementById('back-from-gallery').addEventListener('click', () => { transitionToPage(pages.gallery, pages.gift); });
document.getElementById('back-from-letter').addEventListener('click', () => { transitionToPage(pages.letter, pages.gallery, initGalleryAnimations); });
document.getElementById('back-from-reasons').addEventListener('click', () => { transitionToPage(pages.reasons, pages.letter); });
document.getElementById('back-from-music').addEventListener('click', () => { transitionToPage(pages.music, pages.reasons); });
document.getElementById('back-from-heart').addEventListener('click', () => { transitionToPage(pages.heart, pages.music); });
