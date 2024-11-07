const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

// Conectar a la base de datos
const db = new sqlite3.Database('./database.sqlite'); // Asegúrate de que la ruta sea correcta

// Eliminar tablas existentes, excepto 'users'
db.serialize(() => {
    db.run("PRAGMA foreign_keys = OFF;"); // Desactivar claves foráneas temporalmente para poder eliminar tablas
    db.run(`DROP TABLE IF EXISTS tablas;`);
    db.run(`DROP TABLE IF EXISTS columnas;`);
    db.run(`DROP TABLE IF EXISTS registros;`);
    db.run(`DROP TABLE IF EXISTS valores;`);
    db.run("PRAGMA foreign_keys = ON;"); // Reactivar claves foráneas

    // Crear las tablas
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre_usuario TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        contrasena TEXT NOT NULL,
        fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS tablas (
        id_tabla INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre_tabla TEXT NOT NULL,
        id_usuario INTEGER NOT NULL,
        fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_usuario) REFERENCES users(id_usuario)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS columnas (
        id_columna INTEGER PRIMARY KEY AUTOINCREMENT,
        id_tabla INTEGER NOT NULL,
        nombre_columna TEXT NOT NULL,
        tipo_dato TEXT DEFAULT 'TEXT',
        FOREIGN KEY (id_tabla) REFERENCES tablas(id_tabla)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS registros (
        id_registro INTEGER PRIMARY KEY AUTOINCREMENT,
        id_tabla INTEGER NOT NULL,
        fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion DATETIME,
        FOREIGN KEY (id_tabla) REFERENCES tablas(id_tabla)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS valores (
        id_valor INTEGER PRIMARY KEY AUTOINCREMENT,
        id_registro INTEGER NOT NULL,
        id_columna INTEGER NOT NULL,
        valor TEXT,
        FOREIGN KEY (id_registro) REFERENCES registros(id_registro),
        FOREIGN KEY (id_columna) REFERENCES columnas(id_columna)
    )`);

    // Usuario Hasheado
    const username = 'admin';
    const password = 'admin';

    /*    
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) throw err;

        // Insertar usuario inicial
        db.run(`INSERT INTO users (nombre_usuario, email, contrasena) VALUES (?, ?, ?)`, [username, 'admin@example.com', hashedPassword], function(err) {
            if (err) {
                console.error('Error al insertar el usuario:', err.message);
            } else {
                console.log(`Usuario agregado con ID: ${this.lastID}`);

                // Insertar una tabla de ejemplo
                db.run(`INSERT INTO tablas (id_usuario, nombre_tabla) VALUES (?, ?)`, [this.lastID, 'Tabla de Ejemplo'], function(err) {
                    if (err) {
                        console.error('Error al insertar en tablas:', err.message);
                    } else {
                        const tablaId = this.lastID; // Guarda el ID de la tabla creada

                        db.run(`INSERT INTO columnas (id_tabla, nombre_columna, tipo_dato) VALUES (?, ?, ?)`, [tablaId, 'Nombre', 'TEXT'], function(err) {
                            if (err) {
                                console.error('Error al insertar en columnas:', err.message);
                            } else {
                                const columnaId = this.lastID; // Guarda el ID de la columna creada

                                db.run(`INSERT INTO registros (id_tabla) VALUES (?)`, [tablaId], function(err) {
                                    if (err) {
                                        console.error('Error al insertar en registros:', err.message);
                                    } else {
                                        const registroId = this.lastID;

                                        db.run(`INSERT INTO valores (id_registro, id_columna, valor) VALUES (?, ?, ?)`, [registroId, columnaId, 'Ejemplo de valor'], function(err) {
                                            if (err) {
                                                console.error('Error al insertar en valores:', err.message);
                                            } else {
                                                console.log('Datos iniciales insertados.');
                                            }
                                            // Cerrar la base de datos aquí
                                            db.close();
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    });*/
});
