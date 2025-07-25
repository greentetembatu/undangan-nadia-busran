
document.addEventListener('DOMContentLoaded', function() {
    // Ganti dengan URL Aplikasi Web Anda yang didapatkan dari Google Apps Script
    const GOOGLE_APP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyeLDwIjoHbyCzU8xxw363QXg58qPPDdN1b92_nb_mXga36N7SNV-7mGS9lWBvF3Ig6/exec';

        // --- Guest Name from URL Parameter ---
    const guestNameDisplay = document.getElementById('guest-name-display');
    if (guestNameDisplay) {
        const urlParams = new URLSearchParams(window.location.search);
        const guestName = urlParams.get('to');
        if (guestName) {
            guestNameDisplay.textContent = decodeURIComponent(guestName);
        } else {
            // Opsional: Jika tidak ada parameter 'to', tampilkan teks default
            guestNameDisplay.textContent = "Tamu Undangan Terhormat";
        }
    }

    // --- Form RSVP ---
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpMessage = document.getElementById('rsvpMessage');

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            rsvpMessage.textContent = 'Mengirimkan konfirmasi...';
            rsvpMessage.style.color = '#007bff';

            const formData = new FormData(rsvpForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(GOOGLE_APP_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams(data).toString(),
                });

                const result = await response.json();

                if (result.status === 'success') {
                    rsvpMessage.textContent = 'Konfirmasi kehadiran berhasil dikirim!';
                    rsvpMessage.style.color = 'green';
                    rsvpForm.reset();
                } else {
                    rsvpMessage.textContent = 'Gagal mengirim konfirmasi: ' + result.message;
                    rsvpMessage.style.color = 'red';
                }
            } catch (error) {
                console.error('Error:', error);
                rsvpMessage.textContent = 'Terjadi kesalahan saat mengirim konfirmasi. Silakan coba lagi.';
                rsvpMessage.style.color = 'red';
            }
        });
    }

    // --- Form Ucapan ---
    const wishesForm = document.getElementById('wishesForm');
    const wishesMessage = document.getElementById('wishesMessage');
    const currentWishContainer = document.getElementById('currentWishContainer');
    const prevWishBtn = document.getElementById('prevWishBtn');
    const nextWishBtn = document.getElementById('nextWishBtn');

    let allWishes = [];
    let currentWishIndex = 0;

    if (wishesForm) {
        wishesForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            wishesMessage.textContent = 'Mengirimkan ucapan...';
            wishesMessage.style.color = '#007bff';

            const formData = new FormData(wishesForm);
            const data = Object.fromEntries(formData.entries());

            // Batasi 100 kata
            const words = data.message.split(/\s+/).filter(word => word.length > 0);
            if (words.length > 100) {
                wishesMessage.textContent = 'Pesan/Doa terlalu panjang. Maksimal 100 kata.';
                wishesMessage.style.color = 'red';
                return;
            }

            try {
                const response = await fetch(GOOGLE_APP_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams(data).toString(),
                });

                const result = await response.json();

                if (result.status === 'success') {
                    wishesMessage.textContent = 'Ucapan berhasil dikirim!';
                    wishesMessage.style.color = 'green';
                    wishesForm.reset();
                    fetchAndDisplayWishes(); // Refresh wishes after sending a new one
                } else {
                    wishesMessage.textContent = 'Gagal mengirim ucapan: ' + result.message;
                    wishesMessage.style.color = 'red';
                }
            } catch (error) {
                console.error('Error:', error);
                wishesMessage.textContent = 'Terjadi kesalahan saat mengirim ucapan. Silakan coba lagi.';
                wishesMessage.style.color = 'red';
            }
        });

        // Fungsi untuk mengambil dan menampilkan ucapan
        async function fetchAndDisplayWishes() {
            try {
                const response = await fetch(`${GOOGLE_APP_SCRIPT_URL}?formType=wishes-form`, {
                    method: 'GET',
                    mode: 'cors',
                });
                const result = await response.json();

                if (result.status === 'success' && result.data.length > 0) {
                    allWishes = result.data.reverse(); // Urutkan terbaru di depan
                    currentWishIndex = 0; // Reset index ke ucapan terbaru
                    displayCurrentWish();
                    updateNavigationButtons();
                } else {
                    currentWishContainer.innerHTML = '<p>Belum ada ucapan.</p>';
                    allWishes = [];
                    updateNavigationButtons();
                }
            } catch (error) {
                console.error('Error fetching wishes:', error);
                currentWishContainer.innerHTML = '<p>Gagal memuat ucapan.</p>';
            }
        }

        function displayCurrentWish() {
            if (allWishes.length > 0 && currentWishIndex >= 0 && currentWishIndex < allWishes.length) {
                const wish = allWishes[currentWishIndex];
                currentWishContainer.innerHTML = `
                    <p class="wish-message">"${wish['Pesan/Doa']}"</p>
                    <p class="wisher-name">- ${wish['Nama Anda']}</p>
                `;
            } else {
                currentWishContainer.innerHTML = '<p>Belum ada ucapan.</p>';
            }
        }

        function updateNavigationButtons() {
            prevWishBtn.disabled = currentWishIndex === allWishes.length - 1;
            nextWishBtn.disabled = currentWishIndex === 0;
            prevWishBtn.style.opacity = prevWishBtn.disabled ? '0.5' : '1';
            nextWishBtn.style.opacity = nextWishBtn.disabled ? '0.5' : '1';
        }

        if (prevWishBtn) {
            prevWishBtn.addEventListener('click', () => {
                if (currentWishIndex < allWishes.length - 1) {
                    currentWishIndex++;
                    displayCurrentWish();
                    updateNavigationButtons();
                }
            });
        }

        if (nextWishBtn) {
            nextWishBtn.addEventListener('click', () => {
                if (currentWishIndex > 0) {
                    currentWishIndex--;
                    displayCurrentWish();
                    updateNavigationButtons();
                }
            });
        }

        // Panggil fungsi ini saat halaman dimuat untuk pertama kali
        fetchAndDisplayWishes();
    }
});





































    // --- Copy to Clipboard Function ---
    window.copyToClipboard = function(text, buttonElement) {
        navigator.clipboard.writeText(text).then(() => {
            const messageSpan = buttonElement.nextElementSibling;
            messageSpan.classList.add('show');
            setTimeout(() => {
                messageSpan.classList.remove('show');
            }, 2000); // Hide after 2 seconds
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert('Gagal menyalin. Silakan coba lagi.');
        });
    };

    // --- Intersection Observer for fade-in-up effect ---
    const fadeInElements = document.querySelectorAll('.fade-in-up');

    const observerOptions = {
        root: null, // relative to the viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of the element must be visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    fadeInElements.forEach(element => {
        observer.observe(element);
    });

