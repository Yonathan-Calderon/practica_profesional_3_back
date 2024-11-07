const db = require('../database');

exports.getRecords = (req, res) => {
    db.all('SELECT * FROM registros', [], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(rows);
        }
    });
};

exports.addRecord = (req, res) => {
    const { id_tabla, fecha_creacion, fecha_actualizacion } = req.body;
    db.run('INSERT INTO registros (id_tabla, fecha_creacion, fecha_actualizacion) VALUES (?, ?, ?)', [id_tabla, fecha_creacion, fecha_actualizacion], function(err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json({ id: this.lastID });
        }
    });
};

exports.editRecord = (req, res) => {
    const { id } = req.params;
    const { fecha_actualizacion } = req.body;
    db.run('UPDATE registros SET fecha_actualizacion = ? WHERE id_registro = ?', [fecha_actualizacion, id], function(err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.send('Registro actualizado correctamente');
        }
    });
};

exports.deleteRecord = (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM registros WHERE id_registro = ?', id, function(err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.send('Registro eliminado correctamente');
        }
    });
};

exports.getUserData = (req, res) => {
    const { id } = req.params;

    db.get('SELECT username FROM users WHERE id = ?', [id], (err, user) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        db.all('SELECT * FROM tablas WHERE id_usuario = ?', [id], (err, tablas) => {
            if (err) {
                return res.status(500).send(err.message);
            }

            res.json({
                username: user.username,
                basesDeDatos: tablas
            });
        });
    });
};

exports.getRecordsByTableId = (req, res) => {
    const { id } = req.params;
  
    // Registro de la tabla `tablas`
    db.get('SELECT * FROM tablas WHERE id_tabla = ?', [id], (err, tabla) => {
      if (err) {
        console.error('Error al obtener la tabla:', err);
        return res.status(500).send(err.message);
      }
  
      if (!tabla) {
        return res.status(404).send('Tabla no encontrada');
      }
  
      // Columnas de la tabla
      db.all('SELECT * FROM columnas WHERE id_tabla = ?', [id], (err, columnas) => {
        if (err) {
          console.error('Error al obtener columnas:', err);
          return res.status(500).send(err.message);
        }
  
        // Registros relacionados desde la tabla `registros`
        db.all('SELECT * FROM registros WHERE id_tabla = ?', [id], (err, registros) => {
          if (err) {
            console.error('Error al obtener registros:', err);
            return res.status(500).send(err.message);
          }
  
          // Valores relacionados a los registros y columnas
          db.all('SELECT * FROM valores WHERE id_registro IN (SELECT id_registro FROM registros WHERE id_tabla = ?)', [id], (err, valores) => {
            if (err) {
              console.error('Error al obtener valores:', err);
              return res.status(500).send(err.message);
            }
  
            // Agrupar valores por id_registro
            const valoresPorRegistro = {};
            valores.forEach(valor => {
              if (!valoresPorRegistro[valor.id_registro]) {
                valoresPorRegistro[valor.id_registro] = [];
              }
              valoresPorRegistro[valor.id_registro].push(valor);
            });
  
            // Crear la estructura para mostrar en la pagina
            const response = {
              tabla: {
                id_tabla: tabla.id_tabla,
                nombre_tabla: tabla.nombre_tabla,
                id_usuario: tabla.id_usuario,
                fecha_creacion: tabla.fecha_creacion
              },
              columnas: columnas.map(columna => ({
                id_columna: columna.id_columna,
                id_tabla: columna.id_tabla,
                nombre_columna: columna.nombre_columna,
                tipo_dato: columna.tipo_dato
              })),
              registros: registros.map(registro => ({
                id_registro: registro.id_registro,
                id_tabla: registro.id_tabla,
                fecha_creacion: registro.fecha_creacion,
                fecha_actualizacion: registro.fecha_actualizacion
              })),
              valores: []
            };
  
            // Valores
            response.registros.forEach(registro => {
              response.valores.push(...(valoresPorRegistro[registro.id_registro] || []).map(valor => ({
                id_valor: valor.id_valor,
                id_registro: valor.id_registro,
                id_columna: valor.id_columna,
                valor: valor.valor
              })));
            });
  
            res.json(response);
          });
        });
      });
    });
  };