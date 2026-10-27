const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3000;
const ARCHIVO_USUARIOS = path.join(__dirname, 'usuarios.json');

app.use(cors());
app.use(express.json());
// Servir archivos estáticos del frontend desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Función auxiliar para leer los usuarios del archivo JSON
function leerUsuarios() {
  if (!fs.existsSync(ARCHIVO_USUARIOS)) {
    fs.writeFileSync(ARCHIVO_USUARIOS, JSON.stringify([]));
  }
  const data = fs.readFileSync(ARCHIVO_USUARIOS, 'utf-8');
  return JSON.parse(data || '[]');
}

// Función auxiliar para guardar los usuarios en el archivo JSON
function guardarUsuarios(usuarios) {
  fs.writeFileSync(ARCHIVO_USUARIOS, JSON.stringify(usuarios, null, 2));
}

// RUTAS DE LA API (ENDPOINTS)
// 1. Registro de usuario
app.post('/api/registro', async (req, res) => {
  const { nombre, correo, rol, clave } = req.body;

  if (!nombre || !correo || !rol || !clave) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  const usuarios = leerUsuarios();
  const existe = usuarios.find(u => u.correo.toLowerCase() === correo.toLowerCase());

  if (existe) {
    return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
  }

  // Encriptar contraseña antes de guardar
  const claveEncriptada = await bcrypt.hash(clave, 10);

  const nuevoUsuario = {
    id: Date.now(),
    nombre,
    correo: correo.toLowerCase(),
    rol,
    clave: claveEncriptada,
    historial: [] // Aquí se guardan las cotizaciones de este usuario
  };

  usuarios.push(nuevoUsuario);
  guardarUsuarios(usuarios);

  res.status(201).json({ mensaje: 'Usuario registrado con éxito.' });
});

// 2. Inicio de sesión
app.post('/api/login', async (req, res) => {
  const { correo, clave } = req.body;

  const usuarios = leerUsuarios();
  const usuario = usuarios.find(u => u.correo.toLowerCase() === correo.toLowerCase());

  if (!usuario) {
    return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
  }

  const claveCorrecta = await bcrypt.compare(clave, usuario.clave);
  if (!claveCorrecta) {
    return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
  }

  // Devolvemos la información del usuario sin la contraseña
  res.json({
    mensaje: 'Inicio de sesión exitoso.',
    usuario: {
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
      historial: usuario.historial
    }
  });
});

// 3. Obtener el historial de un usuario
app.get('/api/historial/:correo', (req, res) => {
  const { correo } = req.params;
  const usuarios = leerUsuarios();
  const usuario = usuarios.find(u => u.correo.toLowerCase() === correo.toLowerCase());

  if (!usuario) {
    return res.status(404).json({ error: 'Usuario no encontrado.' });
  }

  res.json({ historial: usuario.historial });
});

// 4. Guardar una nueva cotización en el historial del usuario
app.post('/api/historial', (req, res) => {
  const { correo, cotizacion } = req.body;

  if (!correo || !cotizacion) {
    return res.status(400).json({ error: 'Datos incompletos.' });
  }

  const usuarios = leerUsuarios();
  const index = usuarios.findIndex(u => u.correo.toLowerCase() === correo.toLowerCase());

  if (index === -1) {
    return res.status(404).json({ error: 'Usuario no encontrado.' });
  }

  const nuevaCotizacion = {
    id: Date.now(),
    fecha: new Date().toLocaleString('es-CO'),
    ...cotizacion
  };

  usuarios[index].historial.unshift(nuevaCotizacion); // Agregar al inicio
  guardarUsuarios(usuarios);

  res.json({ mensaje: 'Cotización guardada exitosamente.', historial: usuarios[index].historial });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});