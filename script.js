obtenerJsonEspecialidades(); 
let modulo = document.getElementById("tipoModulo");

modulo.innerHTML = `
    <select>
        <option value="MIS">MODULO INTEGRAL SIMPLE - 3 SESIONES</option>
        <option value="MII">MODULO INTEGRAL INTENSIVO - 5 SESIONES</option>
    </select>
`;




function seleccionEspecialidad () {

let programarEspecialidades = document.getElementById('especialidades');
programarEspecialidades.innerHTML = `
    <select>  
        ${especialidades.map(especialidad => `<option>${especialidad.especialidad}</option>`).join('')}
    </select>
`;
}


let turnos = [
    { hora: '09:00'},
    { hora: '09:30'},
    { hora: '10:00'},
    { hora: '10:30'},
    { hora: '11:00'},
];
let horasTurnos = [];

turnos.forEach((tur) => {
    horasTurnos.push(tur.hora);
});

let programar = document.getElementById('programar');
programar.innerHTML = `
    <select>  
    ${horasTurnos.map(hora => `<option>${hora}</option>`).join('')}
    </select>
`;

document.getElementById('formulario').addEventListener('submit', function (event) {
    event.preventDefault();

    let nombre = document.getElementById('nombre').value;
    let fechaNacimiento = document.getElementById('fecha_nacimiento').value;
    let telefono = document.getElementById('telefono').value;
    let email = document.getElementById('email').value;
    let seleccionModulo = document.getElementById("tipoModulo").querySelector('select').value;
    let especialidadSeleccionada = document.getElementById('especialidades').querySelector('select').value;
    let turnoSeleccionado = document.getElementById('programar').querySelector('select').value;

    const formData = {
        nombre,
        fechaNacimiento,
        telefono,
        email,
        seleccionModulo,
        especialidadSeleccionada,
        turnoSeleccionado,
    };

    console.table(formData);

    updateTable(formData);
});

function findSpecialtyIndex(specialty) {
    for (let i = 0; i < especialidades.length; i++) {
        if (especialidades[i].especialidad === specialty) {
            return i;
        }
    }
    return -1;
}

//funcion de los horarios
function findTimeSlotIndex(time) {
    const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00'];
    return timeSlots.indexOf(time);
}

//funcion de la tabla
function updateTable(formData) {
    const specialtyIndex = findSpecialtyIndex(formData.especialidadSeleccionada);
    const timeSlotIndex = findTimeSlotIndex(formData.turnoSeleccionado);

    if (specialtyIndex !== -1 && timeSlotIndex !== -1) {
        let table = document.querySelector('.tablaGeneral');
        let cellToUpdate = table.rows[timeSlotIndex + 1].cells[specialtyIndex + 1];
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Tu turno ha sido agendado correctamente',
            showConfirmButton: false,
            timer: 2500
        })
        if (cellToUpdate.classList.contains('ocupado')) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Disculpe, el turno seleccionado no está disponible.',
                showConfirmButton: false,
                timer: 2500
            })
            return; // No sigue si ya esta ocupada esa celda
        }

        cellToUpdate.textContent = 'Ocupado';
        cellToUpdate.classList.remove('disponible');
        cellToUpdate.classList.add('ocupado');

 // Los datos agendados se van al LocalStorage
        const appointmentData = JSON.parse(localStorage.getItem('appointments')) || {};
        const timeSlotKey = `${formData.especialidadSeleccionada}-${formData.turnoSeleccionado}`;
        appointmentData[timeSlotKey] = formData;
        localStorage.setItem('appointments', JSON.stringify(appointmentData));
    }
}

// Carga las citas guardadas desde el LocalStorage

function turnosEnPantalla() {
document.addEventListener('DOMContentLoaded', function() {
    const appointmentData = JSON.parse(localStorage.getItem('appointments')) || {};

    for (const timeSlotKey in appointmentData) {
        const [specialty, timeSlot] = timeSlotKey.split('-');
        const formData = appointmentData[timeSlotKey];

        const specialtyIndex = findSpecialtyIndex(specialty);
        const timeSlotIndex = findTimeSlotIndex(timeSlot);

        if (specialtyIndex !== -1 && timeSlotIndex !== -1) {
            let table = document.querySelector('.tablaGeneral');
            let cellToUpdate = table.rows[timeSlotIndex + 1].cells[specialtyIndex + 1];
            
            cellToUpdate.textContent = 'Ocupado';
            cellToUpdate.classList.remove('disponible');
            cellToUpdate.classList.add('ocupado');
        }

// Muestra los datos en una tabla HTML
let datosContainer = document.getElementById('datosContainer');
let table = document.createElement('table');
let tipoModulo = ("MIS" || "MII")
let row = document.createElement('tr');
row.classList.add('turnosAgendados');
row.innerHTML = `
        <td>${formData.nombre}</td>
        <td>${formData.fechaNacimiento}</td>
        <td>${formData.email}</td>
        <td>${tipoModulo}</td>
        <td>${specialty}</td>
        <td>${timeSlot}</td>
        <td>${getCurrentTime()}</td>
        <td><button onclick="cancelarTurno(this)">Cancelar Turno</button></td>
`;

        table.appendChild(row);
            datosContainer.appendChild(table);
        }
    });
}

function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return `${hours}:${minutes}`;
}

function cancelarTurno(button) {
    let row = button.parentNode.parentNode;
    let specialty = row.cells[3].textContent;
    let timeSlot = row.cells[4].textContent;
    Swal.fire({
        position: 'center',
        icon: 'info',
        title: 'Su cita ha sido cancelada.',
        showConfirmButton: false,
        timer: 2500});
    
    // Borrar los datos pedidos del localStorage
    const appointmentData = JSON.parse(localStorage.getItem('appointments')) || {};
    const timeSlotKey = `${specialty}-${timeSlot}`;
    delete appointmentData[timeSlotKey];
    localStorage.setItem('appointments', JSON.stringify(appointmentData));
    
    row.remove();
};

turnosEnPantalla();


let tabla = document.getElementById('tabla');
tabla.innerHTML = `
<table class="tablaGeneral"> 
<tr class="tablaGeneral">
    <td class="tablaGeneral">Horarios</td>
    <td class="tablaGeneral">Psicologia</td>
    <td class="tablaGeneral">Psicopedagogia</td>
    <td class="tablaGeneral">Fonoaudiologia</td>
    <td class="tablaGeneral">Terapia Ocupacional</td>
    <td class="tablaGeneral">Psicomotricidad</td>
    <td class="tablaGeneral">Hidroterapia</td>
    <td class="tablaGeneral">Kinesiologia</td>
</tr>
<tr class="tablaGeneral">
    <td class="tablaGeneral">09:00</td>
    <td id="turnos" class="tablaGeneral disponible">Disponible</td>
    <td id="turnos" class="tablaGeneral disponible">Disponible</td>
    <td id="turnos" class="tablaGeneral disponible">Disponible</td>
    <td id="turnos" class="tablaGeneral disponible">Disponible</td>
    <td id="turnos" class="tablaGeneral disponible">Disponible</td>
    <td id="turnos" class="tablaGeneral disponible">Disponible</td>
    <td id="turnos" class="tablaGeneral disponible">Disponible</td>
</tr>
<tr class="tablaGeneral">
    <td class="tablaGeneral">09:30</td>
    <td id="turnos" class="tablaGeneral disponible">Disponible</td>
    <td id="turnos" class="tablaGeneral disponible">Disponible</td>
    <td id="turnos" class="tablaGeneral disponible">Disponible</td>
    <td id="turnos" class="tablaGeneral disponible">Disponible</td>
    <td id="turnos" class="tablaGeneral disponible">Disponible</td>
    <td id="turnos" class="tablaGeneral disponible">Disponible</td>
    <td id="turnos" class="tablaGeneral disponible">Disponible</td>
</tr>
<tr class="tablaGeneral">
    <td class="tablaGeneral">10:00</td>
    <td id="turnos" class="tablaGeneral disponible">Disponible</td>
    <td id="turnos" class="tablaGeneral disponible">Disponible</td>
    <td id="turnos" class="tablaGeneral disponible">Disponible</td>
    <td id="turnos" class="tablaGeneral disponible">Disponible</td>
    <td id="turnos" class="tablaGeneral disponible">Disponible</td>
    <td id="turnos" class="tablaGeneral disponible">Disponible</td>
    <td id="turnos" class="tablaGeneral disponible">Disponible</td>
</tr>
<tr class="tablaGeneral">
    <td class="tablaGeneral">10:30</td>
    <td id="turnos" class="tablaGeneral disponible">Disponible</td>
    <td id="turnos" class="tablaGeneral disponible">Disponible</td>
    <td id="turnos" class="tablaGeneral disponible">Disponible</td>
    <td id="turnos" class="tablaGeneral disponible">Disponible</td>
    <td id="turnos" class="tablaGeneral disponible">Disponible</td>
    <td id="turnos" class="tablaGeneral disponible">Disponible</td>
    <td id="turnos" class="tablaGeneral disponible">Disponible</td>
</tr>
<tr class="tablaGeneral">
    <td class="tablaGeneral">11:00</td>
    <td id="turnos" class="tablaGeneral disponible">Disponible</td>
    <td id="turnos" class="tablaGeneral disponible">Disponible</td>
    <td id="turnos" class="tablaGeneral disponible">Disponible</td>
    <td id="turnos" class="tablaGeneral disponible">Disponible</td>
    <td id="turnos" class="tablaGeneral disponible">Disponible</td>
    <td id="turnos" class="tablaGeneral disponible">Disponible</td>
    <td id="turnos" class="tablaGeneral disponible">Disponible</td>
</tr>
</table>
<button id="restablecer">Restablecer</button>
`;

// boton restablecer para que borre lo pedido en el locaStorage ESTO LO TENGO QUE MEJORAR PQ PA MI NO ANDA
let restablecer = document.getElementById("restablecer");
restablecer = localStorage.remove(updateTable);
localStorage.setItem('restablecer', JSON.stringify(restablecer));
Swal.fire({
    position: 'center',
    icon: 'ok',
    title: 'Los datos fueron eliminados.',
    showConfirmButton: false,
    timer: 2500})


//json
async function obtenerJsonEspecialidades() {
    const URLJSON = 'especialidades.JSON';
    const respuesta = await fetch(URLJSON);
    const data = await respuesta.json();
    especialidades = data;
    seleccionEspecialidad();
}


