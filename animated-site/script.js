const slides = document.querySelectorAll('.slide');
let current = 0;

const nextBtn = document.querySelector('.control.next');
const prevBtn = document.querySelector('.control.prev');

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
}

function nextSlide() {
  current = (current + 1) % slides.length;
  showSlide(current);
}

function prevSlide() {
  current = (current - 1 + slides.length) % slides.length;
  showSlide(current);
}

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

showSlide(current);
setInterval(nextSlide, 4000);
