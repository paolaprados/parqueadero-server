const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("react-parqueadero");
});

module.exports = router;
