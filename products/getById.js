const { readJsonFile, filePath } = require("./utils");
const path = require("path");

// Отримуємо один товар по його id
async function getById(req, res) {
  try {
    const { id } = req.params;
    const products = await readJsonFile(filePath);

    const product = products.find((p) => p.id === id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).send("Продукт не знайдено");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Внутрішня помилка");
  }
}
module.exports = getById;
