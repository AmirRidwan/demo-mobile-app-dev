const fnb = require("../../data/fnb.json");

exports.getFnb = (req, res) => {
  res.json(fnb);
};
