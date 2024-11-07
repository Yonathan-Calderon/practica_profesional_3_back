const sqlite3 = require('sqlite3').verbose();

// Conectar a la base de datos
const db = new sqlite3.Database('./database.sqlite');

// Vaciado las tablas excepto 'users'
db.serialize(() => {
    db.run(`DELETE FROM tabla_de_registros`, (err) => {
        if (err) console.error('Error al vaciar tabla_de_registros:', err.message);
        else console.log('tabla_de_registros vaciada.');
    });

    db.run(`DELETE FROM columns`, (err) => {
        if (err) console.error('Error al vaciar columns:', err.message);
        else console.log('columns vaciada.');
    });

    db.run(`DELETE FROM entries`, (err) => {
        if (err) console.error('Error al vaciar entries:', err.message);
        else console.log('entries vaciada.');
    });

    db.run(`DELETE FROM entries`, (err) => {
        if (err) console.error('Error al vaciar entries:', err.message);
        else console.log('entries vaciada.');
    });

    // Cerrar la base de datos
    db.close(() => {
        console.log("Base de datos cerrada después de vaciar tablas.");
    });
});
