# Calculadora de Materiales de Construcción 🏗️

Hola, este es nuestro proyecto para la materia de **Interfaces I** de la carrera de Ingeniería de Software en la **Fundación Escuela Tecnológica Jesús Oviedo Pérez (FET)**.

Es una aplicación web sencilla pero muy útil que sirve para calcular la cantidad de materiales que se necesitan para distintos tipos de obras de construcción (muros, vigas, columnas, contrapisos, techos, pisos y pintura). 

También incluye un sistema de registro e inicio de sesión por roles (Estudiante, Ingeniero, Arquitecto, Maestro de Obra).

---

## ¿Cómo se ve la aplicación?

El proyecto cuenta con varias pantallas integradas:
1. **Inicio de sesión:** Para entrar con correo y contraseña.
2. **Registro de usuarios:** Para crear una cuenta nueva y elegir el rol.
3. **Panel principal:** Un menú interactivo con las 7 calculadoras de materiales.
4. **Ventana modal:** Donde metes las medidas y te da el resultado al instante.

---

## Tecnologías que utilicé

Para hacer este proyecto utilicé únicamente las tecnologías básicas de desarrollo web (sin frameworks ni librerías raras):

* **HTML5:** Para armar toda la estructura de las pantallas y formularios.
* **CSS3:** Para los estilos visuales, colores (azul oscuro y dorado), fuentes y hacer que el modal y las tarjetas se vean bien.
* **JavaScript (Vanilla JS):** Para la lógica del inicio de sesión, el cambio de pantallas y todas las fórmulas matemáticas de los materiales.

---

## ¿Qué calcula esta herramienta?

El programa realiza los siguientes cálculos de acuerdo a las especificaciones pedidas:

* **Muro de Ladrillo (30 cm / m²):** Cemento (15.2 kg), Arena (0.115 m³), Ladrillos (120 unidades).
* **Muro de Ladrillo (20 cm / m²):** Cemento (10.9 kg), Arena (0.09 m³), Ladrillos (90 unidades).
* **Viga de Hormigón (por metro lineal):** Cemento (9 kg), Arena (0.02 m³), Piedra (0.02 m²), Hierro Ø8 (4m), Hierro Ø4 (3m).
* **Columna de Hormigón (por metro lineal):** Cemento (7.5 kg), Arena (0.016 m³), Piedra (0.016 m²), Hierro Ø10 (6m), Hierro Ø4 (3m).
* **Contrapisos (por m³):** Cemento (105 kg), Arena (0.45 m³), Piedra (0.9 m³).
* **Techo (por m²):** Cemento (33 kg), Arena (0.072 m³), Piedra (0.072 m³), Hierro Ø8 (7m), Hierro Ø6 (4m).
* **Pisos (por m²):** Calcula el área total y le suma un **10% extra** para cubrir el desperdicio por recortes.
* **Pintura (por m²):** Calcula los litros necesarios tomando en cuenta que 1 litro rinde 6 m².

---

## 📁 Estructura del proyecto

El código está dividido en 3 archivos independientes para mantener todo ordenado:
/
├── index.html       # Estructura principal y maquetado de vistas
├── css
    └── styles.css       # Estilos, colores dorados y responsive
├── js
    └──script.js        # Lógica de login, subprogramas y funciones matemáticas

---

## ¿Cómo probarlo localmente?

No necesitas instalar nada complicado.

1. Clona o descarga este repositorio en tu computadora.
2. Abre la carpeta del proyecto.
3. Haz doble clic en el archivo `index.html` para abrirlo en tu navegador web (Chrome, Edge, Firefox, etc.).
4. ¡Listo! Puedes probar iniciar sesión con los datos por defecto (`usuario@aurum.com` / `123456`) o registrar un usuario nuevo.


---

 Hecho por **Joan David Clavijo, Brayan Stiven Castro y Johan Sebastian Montenegro** — *Estudiantes de Ingeniería de Software*