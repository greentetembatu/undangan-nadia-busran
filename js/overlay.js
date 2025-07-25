document.addEventListener('DOMContentLoaded', () => {
    const landingOverlay = document.getElementById('landingOverlay');
    const openWebsiteBtn = document.getElementById('openWebsiteBtn');
    const backgroundMusic = document.getElementById('background-music');
    const musicToggleButton = document.getElementById('backgroundmusic');
    const mainContent = document.getElementById('mainContent');
    const confettiButton = document.getElementById('confettiButton'); // Tambahkan ini

    let isMusicPlaying = false;

    // --- Countdown Timer ---
    const countdownElement = document.getElementById('countdown');
    const weddingDate = new Date('August 4, 2025 09:00:00').getTime(); // Sesuaikan tanggal pernikahan

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdownElement.innerHTML = `
            <div>${days}<span>Hari</span></div>
            <div>${hours}<span>Jam</span></div>
            <div>${minutes}<span>Menit</span></div>
            <div>${seconds}<span>Detik</span></div>
        `;

        if (distance < 0) {
            clearInterval(countdownInterval);
            countdownElement.innerHTML = "<div>Sudah</div><div>Dimulai!</div>";
        }
    }

    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call to display countdown immediately

    // --- Open Website Button ---
    if (openWebsiteBtn) {
        openWebsiteBtn.addEventListener('click', () => {
            landingOverlay.classList.add('hidden'); // Sembunyikan overlay
            mainContent.classList.add('visible'); // Tampilkan konten utama

            // Play music when the overlay is closed
            if (backgroundMusic) {
                backgroundMusic.play().then(() => {
                    isMusicPlaying = true;
                    musicToggleButton.innerHTML = '<i class="fas fa-pause"></i>';
                }).catch(error => {
                    console.error('Autoplay prevented:', error);
                    // Handle autoplay restriction, maybe show a message to the user
                });
            }

            // Trigger initial fade-in-up animations for visible sections
            document.querySelectorAll('.fade-in-up').forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    el.classList.add('active');
                }
            });
        });
    }

    // --- Music Toggle Button ---
    if (musicToggleButton && backgroundMusic) {
        musicToggleButton.addEventListener('click', () => {
            if (isMusicPlaying) {
                backgroundMusic.pause();
                musicToggleButton.innerHTML = '<i class="fas fa-play"></i>';
            } else {
                backgroundMusic.play();
                musicToggleButton.innerHTML = '<i class="fas fa-pause"></i>';
            }
            isMusicPlaying = !isMusicPlaying;
        });
    }

    // --- Confetti Button ---
    if (confettiButton) {
        confettiButton.addEventListener('click', () => {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        });
    }
});