const mysql = require("mysql");

function insert(pool, data, callback) {
  const inserQuery = `INSERT INTO vehiculos_estacionados(placa, hora_entrada) VALUES (?, ?)`;
  const query = mysql.format(inserQuery, [data.placa, data.hora_entrada]);

  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(query, (err, res) => {
      if (err) {
        if (err.errno === 1062) {
          callback({ error: "placa duplicada" });
        } else {
          console.log(err);
        }
        connection.release();
        return;
      }
      callback({
        message: `la placa ${data.placa} fue ingresada`,
      });
      connection.release();
      return;
    });
  });
}

function remove(pool, data, callback) {
  const obtenerPlaca = `SELECT * FROM vehiculos_estacionados where placa = ?`;
  const placaQuery = mysql.format(obtenerPlaca, [data.placa]);

  const removeQuery = `DELETE FROM vehiculos_estacionados WHERE placa = ?`;
  const deleteQuery = mysql.format(removeQuery, [data.placa]);

  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(placaQuery, (err, res) => {
      if (err) {
        console.log(err);
        connection.release();
        return;
      }
      const hora_entrada = res?.[0]?.hora_entrada;
      pool.getConnection((err, connection) => {
        if (err) throw err;
        connection.query(deleteQuery, (err, res) => {
          if (err) {
            console.log(err);
            connection.release();
            return;
          }
          if (res.affectedRows === 1) {
            console.log(res);
            callback({
              message: `la placa ${data.placa} fue eliminada`,
              hora_entrada,
            });
            connection.release();
          }
          if (res.affectedRows === 0) {
            callback({
              message: `la placa ${data.placa} no existe`,
            });
            connection.release();
          }
        });
      });
    });
  });
}

function read(pool, callback) {
  const readQuery = `SELECT * FROM vehiculos_estacionados`;

  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(readQuery, (err, res) => {
      if (err) {
        console.log(err);

        connection.release();
        return;
      }
      callback(res);
      connection.release();
    });
  });
}
module.exports = { insert, remove, read };
