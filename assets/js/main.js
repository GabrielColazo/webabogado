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

// ================================
// SISTEMA DE TURNOS
// ================================
(function () {
  const SUPABASE_URL = 'https://aajhbbzhwsganqzgcwqk.supabase.co'
  const SUPABASE_KEY = 'sb_publishable_mnOmY-iWZmMtkeV32VDpVg_kFO7lBhK'
  const { createClient } = supabase
  const sb = createClient(SUPABASE_URL, SUPABASE_KEY)

  const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
  const DIAS = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']
  const HORAS = ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00']

  let fecha = new Date()
  let diaSeleccionado = null
  let horaSeleccionada = null
  let ocupados = []

  const elMes = document.getElementById('mes-label')
  const elCal = document.getElementById('turnos-calendario')
  const elHorarios = document.getElementById('turnos-horarios')
  const elSlots = document.getElementById('turnos-slots')
  const elResumen = document.getElementById('turnos-resumen')
  const elForm = document.getElementById('turnos-form')
  const elExito = document.getElementById('turnos-exito')

  if (!elCal) return // si no está la sección, no ejecuta

  document.getElementById('btn-mes-ant').addEventListener('click', () => {
    fecha.setMonth(fecha.getMonth() - 1)
    resetSeleccion()
    renderCalendario()
  })
  document.getElementById('btn-mes-sig').addEventListener('click', () => {
    fecha.setMonth(fecha.getMonth() + 1)
    resetSeleccion()
    renderCalendario()
  })
  document.getElementById('btn-confirmar').addEventListener('click', confirmarTurno)

  function resetSeleccion() {
    diaSeleccionado = null
    horaSeleccionada = null
    ocupados = []
    elHorarios.style.display = 'none'
    elResumen.style.display = 'none'
    elForm.style.display = 'none'
    elExito.style.display = 'none'
  }

  function renderCalendario() {
    const y = fecha.getFullYear()
    const m = fecha.getMonth()
    elMes.textContent = MESES[m] + ' ' + y
    elCal.innerHTML = ''

    DIAS.forEach(d => {
      const h = document.createElement('div')
      h.className = 'turnos-dia-header'
      h.textContent = d
      elCal.appendChild(h)
    })

    const primerDia = new Date(y, m, 1).getDay()
    const diasMes = new Date(y, m + 1, 0).getDate()
    const hoy = new Date()

    for (let i = 0; i < primerDia; i++) {
      const v = document.createElement('div')
      v.className = 'turnos-dia vacio'
      elCal.appendChild(v)
    }

    for (let d = 1; d <= diasMes; d++) {
      const celda = document.createElement('div')
      const estaFecha = new Date(y, m, d)
      const dow = estaFecha.getDay()
      const esPasado = estaFecha < new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
      const esHoy = estaFecha.toDateString() === hoy.toDateString()
      const esFinSemana = dow === 0 || dow === 6

      celda.className = 'turnos-dia'
      if (esHoy) celda.classList.add('hoy')

      if (esPasado || esFinSemana) {
        celda.classList.add('no-disponible')
      } else {
        celda.classList.add('disponible')
        celda.addEventListener('click', () => seleccionarDia(d, y, m))
      }
      if (diaSeleccionado === d) celda.classList.add('seleccionado')
      celda.textContent = d
      elCal.appendChild(celda)
    }
  }

  async function seleccionarDia(d, y, m) {
    diaSeleccionado = d
    horaSeleccionada = null
    elForm.style.display = 'none'
    elResumen.style.display = 'none'
    elExito.style.display = 'none'
    renderCalendario()

    const fechaStr = y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0')

    const { data } = await sb.from('turnos').select('hora').eq('fecha', fechaStr).eq('estado', 'reservado')
    ocupados = data ? data.map(t => t.hora) : []

    elSlots.innerHTML = ''
    HORAS.forEach(h => {
      const slot = document.createElement('div')
      slot.className = ocupados.includes(h) ? 'turnos-slot ocupado' : 'turnos-slot libre'
      slot.textContent = h
      if (!ocupados.includes(h)) {
        slot.addEventListener('click', () => seleccionarHora(h, fechaStr))
      }
      elSlots.appendChild(slot)
    })
    elHorarios.style.display = 'block'
  }

  function seleccionarHora(hora, fechaStr) {
    horaSeleccionada = hora
    document.querySelectorAll('.turnos-slot').forEach(s => s.classList.remove('activo'))
    event.target.classList.add('activo')
    const partes = fechaStr.split('-')
    elResumen.style.display = 'block'
    elResumen.innerHTML = `Turno seleccionado: <strong>${MESES[parseInt(partes[1]) - 1]} ${parseInt(partes[2])}</strong> a las <strong>${hora}</strong>`
    elForm.style.display = 'block'
  }

  async function confirmarTurno() {
    const nombre = document.getElementById('turno-nombre').value.trim()
    const dni = document.getElementById('turno-dni').value.trim()
    const tel = document.getElementById('turno-tel').value.trim()
    if (!nombre || !dni || !tel) { alert('Por favor completá todos los campos.'); return }

    const y = fecha.getFullYear()
    const m = fecha.getMonth()
    const fechaStr = y + '-' + String(m + 1).padStart(2, '0') + '-' + String(diaSeleccionado).padStart(2, '0')

    const btn = document.getElementById('btn-confirmar')
    btn.textContent = 'Guardando...'
    btn.disabled = true

    const { error } = await sb.from('turnos').insert({
      fecha: fechaStr,
      hora: horaSeleccionada,
      nombre,
      dni,
      telefono: tel,
      estado: 'reservado'
    })

    if (error) {
      alert('Hubo un error al guardar. Intentá nuevamente.')
      btn.textContent = 'Confirmar turno'
      btn.disabled = false
      return
    }

    elForm.style.display = 'none'
    elResumen.style.display = 'none'
    elHorarios.style.display = 'none'
    elExito.style.display = 'block'
    diaSeleccionado = null
    horaSeleccionada = null
    renderCalendario()
  }

  renderCalendario()
})()