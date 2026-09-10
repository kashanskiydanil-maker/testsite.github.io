document.addEventListener("DOMContentLoaded", () => {

    const slides = document.querySelectorAll(".slide");
    const tabs = document.querySelectorAll(".slider-tab");
    const dots = document.querySelectorAll(".slider-dots button");
    const bg = document.getElementById("sliderBg");

    const prev = document.querySelector(".slider-prev");
    const next = document.querySelector(".slider-next");

    let current = 0;
    let timer;

    function showSlide(index) {

        if (index < 0) {
            index = slides.length - 1;
        }

        if (index >= slides.length) {
            index = 0;
        }

        current = index;

        // Переключаем слайды
        slides.forEach((slide, i) => {
            slide.classList.toggle("active", i === current);
        });

        // Меняем фоновую картинку
        const newBg = slides[current].dataset.bg;

        if (newBg) {
            bg.style.opacity = "0";

            setTimeout(() => {
                bg.src = newBg;
                bg.style.opacity = "1";
            }, 250);
        }

        // Переключаем нижние кнопки
        tabs.forEach((tab, i) => {
            tab.classList.toggle("active", i === current);
        });

        // Переключаем точки
        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === current);
        });

        restartAutoSlide();
    }

    function nextSlide() {
        showSlide(current + 1);
    }

    function prevSlide() {
        showSlide(current - 1);
    }

    // Стрелки
    next.addEventListener("click", nextSlide);
    prev.addEventListener("click", prevSlide);

    // Нижние кнопки
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            showSlide(Number(tab.dataset.slide));
        });
    });

    // Точки
    dots.forEach(dot => {
        dot.addEventListener("click", () => {
            showSlide(Number(dot.dataset.slide));
        });
    });

    // Автоматическая смена
    function startAutoSlide() {
        timer = setInterval(() => {
            showSlide(current + 1);
        }, 6000);
    }

    function restartAutoSlide() {
        clearInterval(timer);
        startAutoSlide();
    }

    // Свайп на телефоне
    let touchStartX = 0;

    const slider = document.querySelector(".pillars-slider");

    slider.addEventListener("touchstart", e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    slider.addEventListener("touchend", e => {

        const touchEndX = e.changedTouches[0].screenX;
        const distance = touchStartX - touchEndX;

        if (distance > 50) {
            nextSlide();
        }

        if (distance < -50) {
            prevSlide();
        }
    });

    // Запускаем первый слайд
    showSlide(0);

});