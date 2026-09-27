// 1. ESTADO DE SESIÓN Y REGISTRO 

// Base de datos de usuarios en memoria
let listaUsuarios = [
  { correo: "usuario@aurum.com", clave: "123456", nombre: "Carlos Rodríguez", rol: "Estudiante" }
];

let usuarioSesionActiva = null;
let tipoCalculadoraActual = "";

// Mostrar pantallas
function cambiarVista(idVista) {
  document.getElementById("vista-login").classList.remove("activa");
  document.getElementById("vista-registro").classList.remove("activa");
  document.getElementById("vista-dashboard").classList.remove("activa");

  document.getElementById(idVista).classList.add("activa");
}

// Navegación básica de enlaces
document.getElementById("ir-a-registro").addEventListener("click", function (e) {
  e.preventDefault();
  cambiarVista("vista-registro");
});

document.getElementById("ir-a-login").addEventListener("click", function (e) {
  e.preventDefault();
  cambiarVista("vista-login");
});

// Registro de usuario
document.getElementById("formulario-registro").addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = document.getElementById("registro-nombre").value;
  const correo = document.getElementById("registro-correo").value;
  const rol = document.getElementById("registro-rol").value;
  const clave = document.getElementById("registro-clave").value;

  // Guardar nuevo usuario
  const nuevoUsuario = { nombre, correo, rol, clave };
  listaUsuarios.push(nuevoUsuario);

  alert("¡Registro exitoso! Ya puedes iniciar sesión.");
  cambiarVista("vista-login");
});

// Inicio de sesión
document.getElementById("formulario-login").addEventListener("submit", function (e) {
  e.preventDefault();

  const correo = document.getElementById("login-correo").value;
  const clave = document.getElementById("login-clave").value;

  // Buscar usuario
  const usuarioEncontrado = listaUsuarios.find(u => u.correo === correo && u.clave === clave);

  if (usuarioEncontrado) {
    usuarioSesionActiva = usuarioEncontrado;
    cargarDatosPerfil();
    cambiarVista("vista-dashboard");
  } else {
    alert("Correo o contraseña incorrectos. Verifica o regístrate.");
  }
});

// Cargar perfil en pantalla
function cargarDatosPerfil() {
  if (usuarioSesionActiva) {
    document.getElementById("usuario-nombre").textContent = usuarioSesionActiva.nombre;
    document.getElementById("usuario-rol").textContent = usuarioSesionActiva.rol;
    document.getElementById("usuario-inicial").textContent = usuarioSesionActiva.nombre.charAt(0).toUpperCase();
  }
}

// Cerrar sesión
function cerrarSesion() {
  usuarioSesionActiva = null;
  cambiarVista("vista-login");
}

document.getElementById("btn-cerrar-sesion").addEventListener("click", cerrarSesion);
document.getElementById("btn-opcion-salir").addEventListener("click", cerrarSesion);


// 2. SUBPROGRAMAS DE CÁLCULO DE MATERIALES

// Títulos de las opciones
const nombresCalculadoras = {
  muro: "Calcular Muro de Ladrillo",
  viga: "Calcular Viga de Hormigón",
  columna: "Calcular Columna de Hormigón",
  contrapiso: "Calcular Contrapisos",
  techo: "Calcular Techo",
  pisos: "Calcular Pisos",
  pintura: "Calcular Pintura"
};

// Subprograma Principal de Menú de Calculadora
function abrirCalculadora(tipo) {
  tipoCalculadoraActual = tipo;
  document.getElementById("modal-titulo").textContent = nombresCalculadoras[tipo];
  
  // Generar inputs específicos
  generarFormularioCalculadora(tipo);
  
  // Limpiar ventana de resultados
  limpiarResultadosModal();

  // Mostrar Modal
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

// Subprograma de generación de formulario dinámico
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
  } else if (tipo === "techo" || tipo === "pintura") {
    htmlCampos = `
      <div class="campo-formulario">
        <label>SUPERFICIE TOTAL (m²)</label>
        <input type="number" id="input-area" step="0.1" placeholder="Ej. 40" oninput="procesarCalculo()">
      </div>
    `;
  } else if (tipo === "pisos") {
    htmlCampos = `
      <div class="campo-formulario">
        <label>SUPERFICIE A CUBRIR (m²)</label>
        <input type="number" id="input-area" step="0.1" placeholder="Ej. 25" oninput="procesarCalculo()">
      </div>
    `;
  }

  contenedor.innerHTML = htmlCampos;
}


// 3. SUBPROGRAMAS ESPECÍFICOS POR MATERIAL (ALGORITMOS DE OPERACIÓN)

function procesarCalculo() {
  const contenedor = document.getElementById("cuadro-resultados");

  // SUBPROGRAMA 1: MURO DE LADRILLO
  if (tipoCalculadoraActual === "muro") {
    const espesor = document.getElementById("input-espesor").value;
    const area = parseFloat(document.getElementById("input-area").value) || 0;

    if (area <= 0) return limpiarResultadosModal();

    let cemento, arena, ladrillos;

    if (espesor === "30") {
      cemento = (area * 15.2).toFixed(2);
      arena = (area * 0.115).toFixed(3);
      ladrillos = Math.ceil(area * 120);
    } else {
      cemento = (area * 10.9).toFixed(2);
      arena = (area * 0.09).toFixed(3);
      ladrillos = Math.ceil(area * 90);
    }

    contenedor.innerHTML = `
      <div class="resultado-linea">🧱 <strong>Ladrillos:</strong> ${ladrillos} unidades</div>
      <div class="resultado-linea">📦 <strong>Cemento:</strong> ${cemento} kg</div>
      <div class="resultado-linea">🏖️ <strong>Arena:</strong> ${arena} m³</div>
    `;
  }

  // SUBPROGRAMA 2: VIGA DE HORMIGÓN
  else if (tipoCalculadoraActual === "viga") {
    const ml = parseFloat(document.getElementById("input-longitud").value) || 0;

    if (ml <= 0) return limpiarResultadosModal();

    contenedor.innerHTML = `
      <div class="resultado-linea">📦 <strong>Cemento:</strong> ${(ml * 9).toFixed(2)} kg</div>
      <div class="resultado-linea">🏖️ <strong>Arena:</strong> ${(ml * 0.02).toFixed(3)} m³</div>
      <div class="resultado-linea">🪨 <strong>Piedra:</strong> ${(ml * 0.02).toFixed(3)} m²</div>
      <div class="resultado-linea">⚙️ <strong>Hierro Ø8:</strong> ${(ml * 4).toFixed(1)} m</div>
      <div class="resultado-linea">⚙️ <strong>Hierro Ø4:</strong> ${(ml * 3).toFixed(1)} m</div>
    `;
  }

  // SUBPROGRAMA 3: COLUMNA DE HORMIGÓN
  else if (tipoCalculadoraActual === "columna") {
    const ml = parseFloat(document.getElementById("input-longitud").value) || 0;

    if (ml <= 0) return limpiarResultadosModal();

    contenedor.innerHTML = `
      <div class="resultado-linea">📦 <strong>Cemento:</strong> ${(ml * 7.5).toFixed(2)} kg</div>
      <div class="resultado-linea">🏖️ <strong>Arena:</strong> ${(ml * 0.016).toFixed(3)} m³</div>
      <div class="resultado-linea">🪨 <strong>Piedra:</strong> ${(ml * 0.016).toFixed(3)} m²</div>
      <div class="resultado-linea">⚙️ <strong>Hierro Ø10:</strong> ${(ml * 6).toFixed(1)} m</div>
      <div class="resultado-linea">⚙️ <strong>Hierro Ø4:</strong> ${(ml * 3).toFixed(1)} m</div>
    `;
  }

  // SUBPROGRAMA 4: CONTRAPISOS
  else if (tipoCalculadoraActual === "contrapiso") {
    const m3 = parseFloat(document.getElementById("input-volumen").value) || 0;

    if (m3 <= 0) return limpiarResultadosModal();

    contenedor.innerHTML = `
      <div class="resultado-linea">📦 <strong>Cemento:</strong> ${(m3 * 105).toFixed(2)} kg</div>
      <div class="resultado-linea">🏖️ <strong>Arena:</strong> ${(m3 * 0.45).toFixed(3)} m³</div>
      <div class="resultado-linea">🪨 <strong>Piedra:</strong> ${(m3 * 0.9).toFixed(3)} m³</div>
    `;
  }

  // SUBPROGRAMA 5: TECHO
  else if (tipoCalculadoraActual === "techo") {
    const m2 = parseFloat(document.getElementById("input-area").value) || 0;

    if (m2 <= 0) return limpiarResultadosModal();

    contenedor.innerHTML = `
      <div class="resultado-linea">📦 <strong>Cemento:</strong> ${(m2 * 33).toFixed(2)} kg</div>
      <div class="resultado-linea">🏖️ <strong>Arena:</strong> ${(m2 * 0.072).toFixed(3)} m³</div>
      <div class="resultado-linea">🪨 <strong>Piedra:</strong> ${(m2 * 0.072).toFixed(3)} m³</div>
      <div class="resultado-linea">⚙️ <strong>Hierro Ø8:</strong> ${(m2 * 7).toFixed(1)} m</div>
      <div class="resultado-linea">⚙️ <strong>Hierro Ø6:</strong> ${(m2 * 4).toFixed(1)} m</div>
    `;
  }

  // SUBPROGRAMA 6: PISOS
  else if (tipoCalculadoraActual === "pisos") {
    const m2 = parseFloat(document.getElementById("input-area").value) || 0;

    if (m2 <= 0) return limpiarResultadosModal();

    const totalConRecortes = (m2 * 1.10).toFixed(2); // +10%

    contenedor.innerHTML = `
      <div class="resultado-linea">📐 <strong>Superficie real:</strong> ${m2.toFixed(2)} m²</div>
      <div class="resultado-linea">✂️ <strong>Piso total necesario (+10% recortes):</strong> ${totalConRecortes} m²</div>
    `;
  }

  // SUBPROGRAMA 7: PINTURA
  else if (tipoCalculadoraActual === "pintura") {
    const m2 = parseFloat(document.getElementById("input-area").value) || 0;

    if (m2 <= 0) return limpiarResultadosModal();

    const litrosPintura = (m2 / 6).toFixed(2); // 1 L rinde 6 m²

    contenedor.innerHTML = `
      <div class="resultado-linea">🎨 <strong>Superficie de muro:</strong> ${m2.toFixed(2)} m²</div>
      <div class="resultado-linea">🪣 <strong>Pintura requerida:</strong> ${litrosPintura} Litros</div>
    `;
  }
}