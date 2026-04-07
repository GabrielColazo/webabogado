// =========================================
// main.js
// =========================================

// --- Scroll events unificados ---
window.addEventListener('scroll', function() {
  const navbar = document.getElementById('navbar');
  const banner = document.querySelector('.demo-banner');

  // Navbar scroll effect
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Offset navbar por banner demo
  const bannerAltura = banner.offsetHeight;
  const scrollY = window.scrollY;

  if (scrollY >= bannerAltura) {
    navbar.style.top = '0px';
  } else {
    navbar.style.top = (bannerAltura - scrollY) + 'px';
  }
});

// --- Efecto typing en el título del hero ---
const linea1 = "Su mejor defensa";
const linea2 = "comienza aquí";
const elemento = document.querySelector('.hero-titulo');
let i = 0;
let lineaActual = 1;

function typing() {
  if (lineaActual === 1) {
    if (i < linea1.length) {
      elemento.innerHTML = linea1.substring(0, i + 1) + '<br class="d-none d-md-block">';
      i++;
      setTimeout(typing, 80);
    } else {
      i = 0;
      lineaActual = 2;
      setTimeout(typing, 150);
    }
  } else {
    if (i < linea2.length) {
      elemento.innerHTML = linea1 + '<br class="d-none d-md-block">' + linea2.substring(0, i + 1);
      i++;
      setTimeout(typing, 80);
    }
  }
}

setTimeout(typing, 500);

// --- Cerrar menu mobile al hacer click afuera ---
document.addEventListener('click', function(e) {
  const navbar = document.getElementById('navbar');
  const menu = document.getElementById('menuNavbar');

  if (!navbar.contains(e.target)) {
    const bsCollapse = bootstrap.Collapse.getInstance(menu);
    if (bsCollapse) {
      bsCollapse.hide();
    }
  }
});

// --- Partículas flotantes en el hero ---
function crearParticulas() {
  const hero = document.querySelector('.hero');
  const cantidad = 25;

  for (let i = 0; i < cantidad; i++) {
    const particula = document.createElement('div');
    particula.classList.add('hero-particula');

    const tamanio = Math.random() * 4 + 1;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const duracion = Math.random() * 10 + 8;
    const delay = Math.random() * 5;
    const opacidad = Math.random() * 0.5 + 0.1;

    particula.style.cssText = `
      width: ${tamanio}px;
      height: ${tamanio}px;
      left: ${posX}%;
      top: ${posY}%;
      animation-duration: ${duracion}s;
      animation-delay: ${delay}s;
      opacity: ${opacidad};
    `;

    hero.appendChild(particula);
  }
}

crearParticulas();

// --- Efecto tilt 3D en cards del hero ---
document.querySelectorAll('.hero-card').forEach(card => {
  card.addEventListener('mousemove', function(e) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centroX = rect.width / 2;
    const centroY = rect.height / 2;
    const rotarX = ((y - centroY) / centroY) * -8;
    const rotarY = ((x - centroX) / centroX) * 8;

    card.style.transform = `perspective(600px) rotateX(${rotarX}deg) rotateY(${rotarY}deg) translateY(-8px)`;
  });

  card.addEventListener('mouseleave', function() {
    card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateY(0)';
  });
});

// --- Marcar cards como animadas al terminar ---
document.querySelectorAll('.hero-card').forEach(card => {
  card.addEventListener('animationend', function() {
    card.classList.add('animado');
    card.style.opacity = '1';
  });
});

// --- Inicializar offset navbar ---
(function() {
  const banner = document.querySelector('.demo-banner');
  const navbar = document.getElementById('navbar');
  if (banner && navbar) {
    navbar.style.top = banner.offsetHeight + 'px';
  }
})();

// --- Modal automático ---
setTimeout(function() {
  const modal = new bootstrap.Modal(document.getElementById('modalOferta'));
  modal.show();
}, 8000);