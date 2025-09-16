const express = require("express");
const router = express.Router();
const { getFnb } = require("../controllers/fnbController");

router.get("/", getFnb);

module.exports = router;
