const sqlite3 = require('sqlite3').verbose();

// Conectar a la base de datos
const db = new sqlite3.Database('./database.sqlite', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos.');
    }
});

let pendingOperations = 0;

function closeDatabase() {
    if (pendingOperations === 0) {
        db.close((err) => {
            if (err) {
                console.error('Error al cerrar la base de datos:', err.message);
            } else {
                console.log('Base de datos cerrada después de poblar las tablas.');
            }
        });
    }
}

db.serialize(() => {
    db.run(`DELETE FROM valores`);
    db.run(`DELETE FROM registros`);
    db.run(`DELETE FROM columnas`);
    db.run(`DELETE FROM tablas`);

    const tablas = [
        { id: 1, nombre_tabla: 'Datos Personales', id_usuario: 1, fecha_creacion: '2024-11-05 19:45:54' },
        { id: 2, nombre_tabla: 'Calificaciones', id_usuario: 1, fecha_creacion: '2024-11-05 19:45:54' },
        { id: 3, nombre_tabla: 'Actividades Extracurriculares', id_usuario: 1, fecha_creacion: '2024-11-05 19:45:54' }
    ];

    tablas.forEach(tabla => {
        pendingOperations++;
        db.run(
            `INSERT INTO tablas (id_tabla, nombre_tabla, id_usuario, fecha_creacion) VALUES (?, ?, ?, ?)`,
            [tabla.id, tabla.nombre_tabla, tabla.id_usuario, tabla.fecha_creacion],
            (err) => {
                if (err) console.error(`Error al insertar en tablas: ${err.message}`);
                pendingOperations--;
                closeDatabase();
            }
        );
    });

    const columnas = [
        { id_tabla: 1, nombre_columna: 'ID Estudiante', tipo_dato: 'TEXT' },
        { id_tabla: 1, nombre_columna: 'Actividad', tipo_dato: 'TEXT' },
        { id_tabla: 1, nombre_columna: 'Fecha de Inicio', tipo_dato: 'TEXT' },
        { id_tabla: 1, nombre_columna: 'Edad', tipo_dato: 'TEXT' },
        { id_tabla: 1, nombre_columna: 'Género', tipo_dato: 'TEXT' },
        { id_tabla: 1, nombre_columna: 'Correo electrónico', tipo_dato: 'TEXT' },
        { id_tabla: 1, nombre_columna: 'Teléfono', tipo_dato: 'TEXT' },
        { id_tabla: 2, nombre_columna: 'ID Estudiante', tipo_dato: 'TEXT' },
        { id_tabla: 2, nombre_columna: 'Materia', tipo_dato: 'TEXT' },
        { id_tabla: 2, nombre_columna: 'Calificación', tipo_dato: 'TEXT' },
        { id_tabla: 2, nombre_columna: 'Fecha', tipo_dato: 'TEXT' },
        { id_tabla: 3, nombre_columna: 'ID Estudiante', tipo_dato: 'TEXT' },
        { id_tabla: 3, nombre_columna: 'Actividad', tipo_dato: 'TEXT' },
        { id_tabla: 3, nombre_columna: 'Rol', tipo_dato: 'TEXT' },
        { id_tabla: 3, nombre_columna: 'Fecha de Inicio', tipo_dato: 'TEXT' },
        { id_tabla: 3, nombre_columna: 'Fecha de Fin', tipo_dato: 'TEXT' },
        { id_tabla: 3, nombre_columna: 'Descripción', tipo_dato: 'TEXT' }
    ];

    columnas.forEach(columna => {
        pendingOperations++;
        db.run(
            `INSERT INTO columnas (id_tabla, nombre_columna, tipo_dato) VALUES (?, ?, ?)`,
            [columna.id_tabla, columna.nombre_columna, columna.tipo_dato],
            (err) => {
                if (err) console.error(`Error al insertar en columnas: ${err.message}`);
                pendingOperations--;
                closeDatabase();
            }
        );
    });

    const registros = [
        { id_tabla: 1, fecha_creacion: '2024-11-05 19:45:54' },
        { id_tabla: 1, fecha_creacion: '2024-11-05 19:45:54' },
        { id_tabla: 1, fecha_creacion: '2024-11-05 19:45:54' },
        { id_tabla: 2, fecha_creacion: '2024-11-05 19:45:54' },
        { id_tabla: 2, fecha_creacion: '2024-11-05 19:45:54' },
        { id_tabla: 2, fecha_creacion: '2024-11-05 19:45:54' },
        { id_tabla: 3, fecha_creacion: '2024-11-05 19:45:54' },
        { id_tabla: 3, fecha_creacion: '2024-11-05 19:45:54' },
        { id_tabla: 3, fecha_creacion: '2024-11-05 19:45:54' }
    ];

    registros.forEach(registro => {
        pendingOperations++;
        db.run(
            `INSERT INTO registros (id_tabla, fecha_creacion, fecha_actualizacion) VALUES (?, ?, NULL)`,
            [registro.id_tabla, registro.fecha_creacion],
            (err) => {
                if (err) console.error(`Error al insertar en registros: ${err.message}`);
                pendingOperations--;
                closeDatabase();
            }
        );
    });

    const valores = [
        { id_registro: 1, id_columna: 1, valor: '12345' },
        { id_registro: 1, id_columna: 2, valor: 'Matemáticas Avanzadas' },
        { id_registro: 1, id_columna: 3, valor: '2024-01-10' },
        { id_registro: 1, id_columna: 4, valor: '20' },
        { id_registro: 1, id_columna: 5, valor: 'Masculino' },
        { id_registro: 1, id_columna: 6, valor: 'juan.perez@example.com' },
        { id_registro: 1, id_columna: 7, valor: '123-456-7890' },
        
    ];

    valores.forEach(valor => {
        pendingOperations++;
        db.run(
            `INSERT INTO valores (id_registro, id_columna, valor) VALUES (?, ?, ?)`,
            [valor.id_registro, valor.id_columna, valor.valor],
            (err) => {
                if (err) console.error(`Error al insertar en valores: ${err.message}`);
                pendingOperations--;
                closeDatabase();
            }
        );
    });
});

closeDatabase();
