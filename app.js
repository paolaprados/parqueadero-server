const { config } = require("dotenv");
const express = require("express");
const cors = require("cors");
const app = express();
const mysql = require("mysql");
require("dotenv").config();

const { insert, remove, read } = require("./operations");

app.use(express.json());
app.use(cors());

const connetionPool = mysql.createPool({
  host: process.env.DBHOST,
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  database: process.env.DATABASE,
});

const verificaPlaca = /[a-z]{3}[0-9]{3}/gi;

app.get("/", (req, res) => {
  read(connetionPool, result => {
    res.json(result);
  });
});

app.post("/ingresar", (req, res) => {
  const placa = req.query.placa.substring(0, 6);
  const hora_entrada = req.query.hora_entrada;
  const esPlacaValida = placa.match(verificaPlaca)?.[0] === placa;

  if (!esPlacaValida) {
    res.json({
      error: "la placa no es valida",
    });
    return;
  } else if (!hora_entrada) {
    res.json({
      error: "necesita ingresar hora de entrada",
    });
    return;
  }

  insert(connetionPool, { placa, hora_entrada }, result => {
    res.json(result);
  });
});
app.delete("/salir", (req, res) => {
  const placa = req.query.placa.substring(0, 6);
  const esPlacaValida = placa.match(verificaPlaca)?.[0] === placa;

  if (!esPlacaValida) {
    res.json({
      error: "la placa no es valida",
    });
    return;
  } else {
    remove(connetionPool, { placa }, result => {
      res.json(result);
    });
  }
});

app.listen(3001, () => {
  console.log("sevidor en puerto 3001...");
});
