// Espera a que el DOM este completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    // Carga las noticias desde un archivo JSON externo
    fetch("../data/noticias.json")
        .then(response => response.json())
        .then(noticias => {
            const contenedor = document.getElementById("contenedor-noticias");
            contenedor.innerHTML = ""; // Limpia el contenido inicial
            
            // Recorre cada noticia y la agrega al contenedor
            noticias.forEach(noticia => {
                const noticiaElemento = document.createElement("div");
                noticiaElemento.classList.add("noticia");
                noticiaElemento.innerHTML = `
                    <h3>${noticia.titulo}</h3>
                    <p>${noticia.descripcion}</p>
                    <small>${noticia.fecha}</small>
                `;
                contenedor.appendChild(noticiaElemento);
            });
        })
        .catch(error => {
            console.error("Error al cargar las noticias:", error);
            document.getElementById("contenedor-noticias").innerHTML = "<p>No se pudieron cargar las noticias.</p>";
        });
});

// Manejo del formulario de presupuesto
document.addEventListener("DOMContentLoaded", function () {
    // Seleccion de elementos del formulario
    const form = document.getElementById("formPresupuesto");
    const nombre = document.getElementById("nombre");
    const apellidos = document.getElementById("apellidos");
    const telefono = document.getElementById("telefono");
    const email = document.getElementById("email");
    const productoInput = document.getElementById("producto");
    const extras = document.querySelectorAll('input[name="extra"]');
    const presupuestoTotal = document.getElementById("presupuestoTotal");

    // Funcion para mostrar mensajes de error dinámicos
    function mostrarError(input, mensaje) {
        let error = input.nextElementSibling;
        if (!error || !error.classList.contains("error-msg")) {
            error = document.createElement("p");
            error.classList.add("error-msg");
            error.style.color = "red";
            error.style.fontSize = "12px";
            input.parentNode.appendChild(error);
        }
        error.textContent = mensaje;
    }

    // Funcion para limpiar errores
    function limpiarError(input) {
        let error = input.nextElementSibling;
        if (error && error.classList.contains("error-msg")) {
            error.remove();
        }
    }

    // Funciones de validación para cada campo
    function validarNombre() {
        if (nombre.value.length > 15 || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre.value)) {
            mostrarError(nombre, "El nombre debe contener solo letras y tener un máximo de 15 caracteres.");
            return false;
        }
        limpiarError(nombre);
        return true;
    }

    function validarApellidos() {
        if (apellidos.value.length > 40 || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(apellidos.value)) {
            mostrarError(apellidos, "Los apellidos deben contener solo letras y tener un máximo de 40 caracteres.");
            return false;
        }
        limpiarError(apellidos);
        return true;
    }

    function validarTelefono() {
        if (!/^\d{9}$/.test(telefono.value)) {
            mostrarError(telefono, "El teléfono debe contener exactamente 9 dígitos numéricos.");
            return false;
        }
        limpiarError(telefono);
        return true;
    }

    function validarEmail() {
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.value)) {
            mostrarError(email, "Ingrese un correo electrónico válido.");
            return false;
        }
        limpiarError(email);
        return true;
    }

    // Eventos para validar en tiempo real
    nombre.addEventListener("input", validarNombre);
    apellidos.addEventListener("input", validarApellidos);
    telefono.addEventListener("input", validarTelefono);
    email.addEventListener("input", validarEmail);

    // Validar formulario al enviarlo
    form.addEventListener("submit", function (event) {
        if (!validarNombre() || !validarApellidos() || !validarTelefono() || !validarEmail()) {
            event.preventDefault(); // Evita el envío si hay errores
        }
    });

    // Cálculo del presupuesto dinamico
    const precioBase = 50;
    const descuentos = [
        { min: 1, max: 3, descuento: 0 },
        { min: 4, max: 6, descuento: 0.05 },
        { min: 7, max: 9, descuento: 0.10 },
        { min: 10, max: 12, descuento: 0.15 }
    ];

    function calcularPresupuesto() {
        let cantidad = parseInt(productoInput.value) || 0;
        let precioFinal = precioBase * cantidad;

        // Aplicar descuentos segun la cantidad
        let descuentoAplicado = 0;
        descuentos.forEach(d => {
            if (cantidad >= d.min && cantidad <= d.max) {
                descuentoAplicado = d.descuento;
            }
        });
        precioFinal -= precioFinal * descuentoAplicado;

        // Agregar el costo de los extras seleccionados
        extras.forEach(extra => {
            if (extra.checked) {
                precioFinal += parseFloat(extra.value);
            }
        });

        presupuestoTotal.textContent = `$${precioFinal.toFixed(2)}`;
    }

    // Eventos para actualizar el presupuesto automáticamente
    productoInput.addEventListener("input", calcularPresupuesto);
    extras.forEach(extra => extra.addEventListener("change", calcularPresupuesto));

    // Calcular presupuesto inicial
    calcularPresupuesto();
});

// Contacto
document.addEventListener("DOMContentLoaded", function() {
    var map = L.map('map').setView([40.34905367067275, -3.8279948765932237], 15);

    // Capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Marcar la ubicacion de la tienda
    var tienda = L.marker([40.34905367067275, -3.8279948765932237]).addTo(map)
        .bindPopup('Tienda de Calzados F51<br>Alcorcón, Madrid')
        .openPopup();

    var rutaLayer; // Para almacenar la ruta

    var rutaBtn = document.getElementById('rutaBtn');

    // Verificar si el boton existe antes de agregar el evento
    if (rutaBtn) {
        rutaBtn.addEventListener('click', function() {
            if (!navigator.geolocation) {
                alert('Tu navegador no soporta geolocalización.');
                return;
            }

            navigator.geolocation.getCurrentPosition(function(position) {
                var userLat = position.coords.latitude;
                var userLng = position.coords.longitude;

                var userLocation = L.marker([userLat, userLng]).addTo(map)
                    .bindPopup('Tu ubicación')
                    .openPopup();

                // Construir la URL de OSRM con las coordenadas correctas
                var osrmURL = `https://router.project-osrm.org/route/v1/driving/${userLng},${userLat};${-3.8279948765932237},${40.34905367067275}?overview=full&geometries=geojson`;

                fetch(osrmURL)
                    .then(response => response.json())
                    .then(data => {
                        if (data.routes && data.routes.length > 0) {
                            if (rutaLayer) {
                                map.removeLayer(rutaLayer);
                            }

                            var routeCoords = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
                            
                            // Dibujar la ruta en el mapa
                            rutaLayer = L.polyline(routeCoords, { color: 'blue', weight: 5 }).addTo(map);
                            
                            map.fitBounds(rutaLayer.getBounds());
                        } else {
                            alert('No se pudo calcular la ruta.');
                        }
                    })
                    .catch(error => console.error('Error al calcular la ruta:', error));
            }, function() {
                alert('No se pudo obtener tu ubicación.');
            });
        });
    } else {
        console.error("El botón de ruta no se encontró en el DOM.");
    }
});
