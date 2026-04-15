const slidesTrack = document.getElementById("slidesTrack");
const slides = [...document.querySelectorAll(".slide")];
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const dotsWrap = document.getElementById("dots");
const burstBtn = document.getElementById("burstBtn");
const heartsBg = document.getElementById("hearts-bg");
const greetingCards = [...document.querySelectorAll(".greet-card")];
const greetProgress = document.getElementById("greetProgress");

let index = 0;
let autoPlay;

function renderDots() {
    dotsWrap.innerHTML = "";
    slides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.className = "dot";
        dot.type = "button";
        dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
        dot.addEventListener("click", () => goToSlide(i));
        dotsWrap.appendChild(dot);
    });
}

function updateUI() {
    slidesTrack.style.transform = `translateX(-${index * 100}%)`;
    
    // Update dots
    [...dotsWrap.children].forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
    });

    // Smart Delay Handling
    const currentSlide = slides[index];
    let delay = 6000; // Default 6s

    if (currentSlide.classList.contains("cards-slide")) {
        delay = 50000; // 50s for interaction
    } else if (currentSlide.classList.contains("letter-slide")) {
        delay = 180000; // 3 mins for reading
    }

    restartAutoplay(delay);
}

function goToSlide(nextIndex) {
    index = (nextIndex + slides.length) % slides.length;
    updateUI();
}

function nextSlide() {
    goToSlide(index + 1);
}

function prevSlide() {
    goToSlide(index - 1);
}

function restartAutoplay(customDelay) {
    clearInterval(autoPlay);
    const delay = customDelay || 6000;
    autoPlay = setInterval(nextSlide, delay);
}

function spawnHeart(burst = false) {
    const heart = document.createElement("span");
    heart.className = "heart";
    heart.textContent = ["❤", "💕", "💖", "💗"][Math.floor(Math.random() * 4)];
    const startX = burst ? Math.random() * 100 : Math.random() * 100;
    const duration = burst ? 2500 + Math.random() * 800 : 7000 + Math.random() * 3000;
    const size = burst ? 14 + Math.random() * 24 : 12 + Math.random() * 16;
    heart.style.left = `${startX}%`;
    heart.style.bottom = burst ? "15%" : "-30px";
    heart.style.fontSize = `${size}px`;
    heart.style.animationDuration = `${duration}ms`;
    heartsBg.appendChild(heart);
    setTimeout(() => heart.remove(), duration);
}

function createAmbientHearts() {
    setInterval(() => spawnHeart(false), 450);
}

function setupGreetingCards() {
    if (!greetingCards.length || !greetProgress) {
        return;
    }

    let openedCount = 0;

    function updateProgress() {
        greetProgress.textContent = `${openedCount} / ${greetingCards.length} opened`;
    }

    greetingCards.forEach((card, i) => {
        card.addEventListener("click", () => {
            if (!card.classList.contains("is-active")) {
                return;
            }

            card.classList.remove("is-active");
            card.classList.add("is-opened");
            openedCount += 1;

            const nextCard = greetingCards[i + 1];
            if (nextCard) {
                nextCard.classList.remove("is-locked");
                nextCard.classList.add("is-active");
            } else {
                greetProgress.textContent = "All 4 / 4 opened - perfect!";
                // Little delay before moving forward automatically if all are read
                setTimeout(() => {
                    if (index === slides.findIndex(s => s.classList.contains("cards-slide"))) {
                        nextSlide();
                    }
                }, 6000);
            }

            for (let j = 0; j < 10; j += 1) {
                setTimeout(() => spawnHeart(true), j * 45);
            }

            if (openedCount < greetingCards.length) {
                updateProgress();
            }
        });
    });

    updateProgress();
}

document.querySelectorAll("[data-go]").forEach((btn) => {
    btn.addEventListener("click", () => {
        goToSlide(Number(btn.dataset.go));
        restartAutoplay();
    });
});

nextBtn.addEventListener("click", () => {
    nextSlide();
    restartAutoplay();
});

prevBtn.addEventListener("click", () => {
    prevSlide();
    restartAutoplay();
});

burstBtn.addEventListener("click", () => {
    for (let i = 0; i < 35; i += 1) {
        setTimeout(() => spawnHeart(true), i * 35);
    }
});

window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
        nextSlide();
        restartAutoplay();
    }
    if (event.key === "ArrowLeft") {
        prevSlide();
        restartAutoplay();
    }
});

renderDots();
updateUI();
createAmbientHearts();
restartAutoplay();
setupGreetingCards();
