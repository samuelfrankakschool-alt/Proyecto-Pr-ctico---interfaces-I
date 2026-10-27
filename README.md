# Calculadora de Materiales de Construccion 🏗️

Proyecto desarrollado para la materia de Interfaces I de la carrera de Ingenieria de Software en la Fundacion Escuela Tecnologica Jesus Oviedo Perez (FET).

Consiste en una aplicacion web para calcular la cantidad de materiales necesarios en distintas obras de construccion (muros, vigas, columnas, contrapisos, techos, pisos y pintura). El sistema cuenta con autenticacion real de usuarios, registro por roles (Estudiante, Ingeniero, Arquitecto, Maestro de Obra) y un historial donde cada usuario puede guardar y consultar sus cotizaciones.

---

## Estructura y pantallas

La interfaz esta integrada por las siguientes vistas:
1. Inicio de sesion: Pantalla de acceso mediante correo electronico y contrasena.
2. Registro de usuarios: Formulario para dar de alta una nueva cuenta eligiendo el perfil profesional.
3. Panel principal: Menu interactivo con las 7 calculadoras de materiales y la seccion del historial de cotizaciones personales.
4. Ventana modal: Interfaz emergente para ingresar medidas, visualizar los resultados y guardarlos directamente en el servidor.

---

## Tecnologias utilizadas

Para este proyecto utilizamos desarrollo web base combinado con un servidor backend sencillo:
* HTML5: Estructura de vistas y formularios.
* CSS3: Diseno visual, paleta de colores oscuro/dorado y adaptabilidad.
* JavaScript (Vanilla JS): Logica de interaccion en el navegador y llamadas asincronas (fetch) hacia el servidor.
* Node.js y Express: Servidor backend para gestionar el registro, inicio de sesion y las peticiones del historial.
* Bcryptjs: Libreria para encriptar las contraseñas de forma segura en el servidor.

---

## Calculos implementados

El sistema realiza los calculos segun las especificaciones pedidas:
* Muro de Ladrillo (30 cm / m²): Cemento (15.2 kg), Arena (0.115 m³), Ladrillos (120 unidades).
* Muro de Ladrillo (20 cm / m²): Cemento (10.9 kg), Arena (0.09 m³), Ladrillos (90 unidades).
* Viga de Hormigon (por metro lineal): Cemento (9 kg), Arena (0.02 m³), Piedra (0.02 m²), Hierro Ø8 (4m), Hierro Ø4 (3m).
* Columna de Hormigon (por metro lineal): Cemento (7.5 kg), Arena (0.016 m³), Piedra (0.016 m²), Hierro Ø10 (6m), Hierro Ø4 (3m).
* Contrapisos (por m³): Cemento (105 kg), Arena (0.45 m³), Piedra (0.9 m³).
* Techo (por m²): Cemento (33 kg), Arena (0.072 m³), Piedra (0.072 m³), Hierro Ø8 (7m), Hierro Ø6 (4m).
* Pisos (por m²): Calcula el area total y anade un 10% extra por recortes.
* Pintura (por m²): Calcula los litros necesarios tomando un rendimiento de 1 litro por cada 6 m².

---

## 📁 Estructura del proyecto

El codigo esta organizado de la siguiente manera:

```text
aurum-backend/
├── public/
│   ├── index.html       # Estructura principal y maquetado de vistas
│   ├── styles.css       # Estilos visuales y diseno
│   └── script.js        # Logica del navegador y conexion con la API
├── server.js            # Servidor de Node.js y Express con las rutas del backend
├── package.json         # Configuracion y dependencias del proyecto
└── usuarios.json        # Base de datos local en archivo JSON para persistencia