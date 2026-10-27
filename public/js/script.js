const API_URL = 'http://localhost:3000/api';

let usuarioSesionActiva = null;
let tipoCalculadoraActual = "";
let ultimaCotizacionCalculada = null;

// Subprograma: Mostrar pantallas
function cambiarVista(idVista) {
  document.getElementById("vista-login").classList.remove("activa");
  document.getElementById("vista-registro").classList.remove("activa");
  document.getElementById("vista-dashboard").classList.remove("activa");

  document.getElementById(idVista).classList.add("activa");
}

// Navegación de enlaces
document.getElementById("ir-a-registro").addEventListener("click", function (e) {
  e.preventDefault();
  cambiarVista("vista-registro");
});

document.getElementById("ir-a-login").addEventListener("click", function (e) {
  e.preventDefault();
  cambiarVista("vista-login");
});

// 1. REGISTRO DE USUARIO (backend)
document.getElementById("formulario-registro").addEventListener("submit", async function (e) {
  e.preventDefault();

  const nombre = document.getElementById("registro-nombre").value;
  const correo = document.getElementById("registro-correo").value;
  const rol = document.getElementById("registro-rol").value;
  const clave = document.getElementById("registro-clave").value;

  try {
    const respuesta = await fetch(`${API_URL}/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, correo, rol, clave })
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
      alert(data.error || 'Error al registrar usuario.');
      return;
    }

    alert("¡Registro exitoso! Ya puedes iniciar sesión.");
    document.getElementById("formulario-registro").reset();
    cambiarVista("vista-login");
  } catch (err) {
    alert("Error de conexión con el servidor.");
  }
});

// 2. INICIO DE SESIÓN (backend)
document.getElementById("formulario-login").addEventListener("submit", async function (e) {
  e.preventDefault();

  const correo = document.getElementById("login-correo").value;
  const clave = document.getElementById("login-clave").value;

  try {
    const respuesta = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, clave })
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
      alert(data.error || 'Credenciales incorrectas.');
      return;
    }

    usuarioSesionActiva = data.usuario;
    cargarDatosPerfil();
    renderizarHistorial(usuarioSesionActiva.historial);
    cambiarVista("vista-dashboard");
  } catch (err) {
    alert("Error de conexión con el servidor.");
  }
});

function cargarDatosPerfil() {
  if (usuarioSesionActiva) {
    document.getElementById("usuario-nombre").textContent = usuarioSesionActiva.nombre;
    document.getElementById("usuario-rol").textContent = usuarioSesionActiva.rol;
    document.getElementById("usuario-inicial").textContent = usuarioSesionActiva.nombre.charAt(0).toUpperCase();
  }
}

function cerrarSesion() {
  usuarioSesionActiva = null;
  document.getElementById("formulario-login").reset();
  cambiarVista("vista-login");
}

document.getElementById("btn-cerrar-sesion").addEventListener("click", cerrarSesion);
document.getElementById("btn-opcion-salir").addEventListener("click", cerrarSesion);

// CÁLCULOS DE MATERIALES Y MODAL

const nombresCalculadoras = {
  muro: "Calcular Muro de Ladrillo",
  viga: "Calcular Viga de Hormigón",
  columna: "Calcular Columna de Hormigón",
  contrapiso: "Calcular Contrapisos",
  techo: "Calcular Techo",
  pisos: "Calcular Pisos",
  pintura: "Calcular Pintura"
};

function abrirCalculadora(tipo) {
  tipoCalculadoraActual = tipo;
  ultimaCotizacionCalculada = null;
  document.getElementById("modal-titulo").textContent = nombresCalculadoras[tipo];
  document.getElementById("btn-guardar-cotizacion").style.display = "none";
  
  generarFormularioCalculadora(tipo);
  limpiarResultadosModal();

  document.getElementById("modal-calculadora").classList.add("activo");
}

function cerrarCalculadora() {
  document.getElementById("modal-calculadora").classList.remove("activo");
}

function limpiarResultadosModal() {
  document.getElementById("cuadro-resultados").innerHTML = `
    <p class="texto-vacio">📐 Ingresa los datos requeridos para calcular</p>
  `;
}

function generarFormularioCalculadora(tipo) {
  const contenedor = document.getElementById("modal-campos-formulario");
  let htmlCampos = "";

  if (tipo === "muro") {
    htmlCampos = `
      <div class="campo-formulario">
        <label>TIPO DE MURO</label>
        <select id="input-espesor" onchange="procesarCalculo()">
          <option value="30">Muro de 30 cm</option>
          <option value="20">Muro de 20 cm</option>
        </select>
      </div>
      <div class="campo-formulario">
        <label>ÁREA / SUPERFICIE (m²)</label>
        <input type="number" id="input-area" step="0.1" placeholder="Ej. 15" oninput="procesarCalculo()">
      </div>
    `;
  } else if (tipo === "viga" || tipo === "columna") {
    htmlCampos = `
      <div class="campo-formulario">
        <label>LONGITUD TOTAL (Metros lineales)</label>
        <input type="number" id="input-longitud" step="0.1" placeholder="Ej. 6" oninput="procesarCalculo()">
      </div>
    `;
  } else if (tipo === "contrapiso") {
    htmlCampos = `
      <div class="campo-formulario">
        <label>VOLUMEN TOTAL (m³)</label>
        <input type="number" id="input-volumen" step="0.1" placeholder="Ej. 2.5" oninput="procesarCalculo()">
      </div>
    `;
  } else if (tipo === "techo" || tipo === "pintura" || tipo === "pisos") {
    htmlCampos = `
      <div class="campo-formulario">
        <label>SUPERFICIE TOTAL (m²)</label>
        <input type="number" id="input-area" step="0.1" placeholder="Ej. 40" oninput="procesarCalculo()">
      </div>
    `;
  }

  contenedor.innerHTML = htmlCampos;
}

function procesarCalculo() {
  const contenedor = document.getElementById("cuadro-resultados");
  const btnGuardar = document.getElementById("btn-guardar-cotizacion");
  let detalles = [];

  if (tipoCalculadoraActual === "muro") {
    const espesor = document.getElementById("input-espesor").value;
    const area = parseFloat(document.getElementById("input-area").value) || 0;
    if (area <= 0) { btnGuardar.style.display = "none"; return limpiarResultadosModal(); }

    let cemento = (espesor === "30" ? area * 15.2 : area * 10.9).toFixed(2);
    let arena = (espesor === "30" ? area * 0.115 : area * 0.09).toFixed(3);
    let ladrillos = Math.ceil(espesor === "30" ? area * 120 : area * 90);

    detalles = [
      `Área: ${area} m² (Muro ${espesor} cm)`,
      `Ladrillos: ${ladrillos} und`,
      `Cemento: ${cemento} kg`,
      `Arena: ${arena} m³`
    ];
  } else if (tipoCalculadoraActual === "viga") {
    const ml = parseFloat(document.getElementById("input-longitud").value) || 0;
    if (ml <= 0) { btnGuardar.style.display = "none"; return limpiarResultadosModal(); }

    detalles = [
      `Longitud: ${ml} ml`,
      `Cemento: ${(ml * 9).toFixed(2)} kg`,
      `Arena: ${(ml * 0.02).toFixed(3)} m³`,
      `Piedra: ${(ml * 0.02).toFixed(3)} m²`,
      `Hierro Ø8: ${(ml * 4).toFixed(1)} m`,
      `Hierro Ø4: ${(ml * 3).toFixed(1)} m`
    ];
  } else if (tipoCalculadoraActual === "columna") {
    const ml = parseFloat(document.getElementById("input-longitud").value) || 0;
    if (ml <= 0) { btnGuardar.style.display = "none"; return limpiarResultadosModal(); }

    detalles = [
      `Longitud: ${ml} ml`,
      `Cemento: ${(ml * 7.5).toFixed(2)} kg`,
      `Arena: ${(ml * 0.016).toFixed(3)} m³`,
      `Piedra: ${(ml * 0.016).toFixed(3)} m²`,
      `Hierro Ø10: ${(ml * 6).toFixed(1)} m`,
      `Hierro Ø4: ${(ml * 3).toFixed(1)} m`
    ];
  } else if (tipoCalculadoraActual === "contrapiso") {
    const m3 = parseFloat(document.getElementById("input-volumen").value) || 0;
    if (m3 <= 0) { btnGuardar.style.display = "none"; return limpiarResultadosModal(); }

    detalles = [
      `Volumen: ${m3} m³`,
      `Cemento: ${(m3 * 105).toFixed(2)} kg`,
      `Arena: ${(m3 * 0.45).toFixed(3)} m³`,
      `Piedra: ${(m3 * 0.9).toFixed(3)} m³`
    ];
  } else if (tipoCalculadoraActual === "techo") {
    const m2 = parseFloat(document.getElementById("input-area").value) || 0;
    if (m2 <= 0) { btnGuardar.style.display = "none"; return limpiarResultadosModal(); }

    detalles = [
      `Área: ${m2} m²`,
      `Cemento: ${(m2 * 33).toFixed(2)} kg`,
      `Arena: ${(m2 * 0.072).toFixed(3)} m³`,
      `Piedra: ${(m2 * 0.072).toFixed(3)} m³`,
      `Hierro Ø8: ${(m2 * 7).toFixed(1)} m`,
      `Hierro Ø6: ${(m2 * 4).toFixed(1)} m`
    ];
  } else if (tipoCalculadoraActual === "pisos") {
    const m2 = parseFloat(document.getElementById("input-area").value) || 0;
    if (m2 <= 0) { btnGuardar.style.display = "none"; return limpiarResultadosModal(); }

    detalles = [
      `Área real: ${m2} m²`,
      `Piso total (+10% recortes): ${(m2 * 1.10).toFixed(2)} m²`
    ];
  } else if (tipoCalculadoraActual === "pintura") {
    const m2 = parseFloat(document.getElementById("input-area").value) || 0;
    if (m2 <= 0) { btnGuardar.style.display = "none"; return limpiarResultadosModal(); }

    detalles = [
      `Área: ${m2} m²`,
      `Pintura requerida: ${(m2 / 6).toFixed(2)} Litros`
    ];
  }

  // Guardar objeto de cotización temporal
  ultimaCotizacionCalculada = {
    tipo: nombresCalculadoras[tipoCalculadoraActual],
    resumen: detalles.join(' | ')
  };

  contenedor.innerHTML = detalles.map(d => `<div class="resultado-linea">🔹 ${d}</div>`).join('');
  btnGuardar.style.display = "block";
}

// 3. GUARDAR COTIZACIÓN EN EL SERVIDOR
async function guardarCotizacionEnBackend() {
  if (!usuarioSesionActiva || !ultimaCotizacionCalculada) return;

  try {
    const respuesta = await fetch(`${API_URL}/historial`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        correo: usuarioSesionActiva.correo,
        cotizacion: ultimaCotizacionCalculada
      })
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
      alert(data.error || 'Error al guardar cotización.');
      return;
    }

    alert("¡Cotización guardada en tu historial!");
    usuarioSesionActiva.historial = data.historial;
    renderizarHistorial(data.historial);
    cerrarCalculadora();
  } catch (err) {
    alert("Error de conexión al guardar.");
  }
}

// Renderizar historial en la interfaz
function renderizarHistorial(historial) {
  const contenedor = document.getElementById("contenedor-historial");
  if (!historial || historial.length === 0) {
    contenedor.innerHTML = '<p class="texto-pequeno">No tienes cotizaciones guardadas aún.</p>';
    return;
  }

  contenedor.innerHTML = historial.map(item => `
    <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid #1e293b; padding: 10px; border-radius: 6px; margin-bottom: 8px; text-align: left;">
      <div style="display: flex; justify-content: space-between; font-size: 11px; color: #fef08a; font-weight: bold;">
        <span>🏗️ ${item.tipo}</span>
        <span style="color: #94a3b8; font-weight: normal;">${item.fecha}</span>
      </div>
      <p style="font-size: 11px; color: #cbd5e1; margin-top: 4px;">${item.resumen}</p>
    </div>
  `).join('');
}