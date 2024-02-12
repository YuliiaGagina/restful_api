const fs = require("fs/promises");
const path = require("path");
const { readJsonFile, filePath } = require("./utils");

// функція для отримання усіх товарів

async function getAll(req, res) {
  try {
    const products = await readJsonFile(filePath);
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).send("Внутрішня помилка");
  }
}

module.exports = getAll;
