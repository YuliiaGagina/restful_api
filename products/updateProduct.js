const { readJsonFile, writeJsonFile } = require("./utils");
const path = require("path");
const filePath = path.join(__dirname, "products.json");

// функція для оновлення продукту

async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const updatedProduct = req.body;

    const products = await readJsonFile(filePath);
    const index = products.findIndex((p) => p.id === id);

    if (index !== -1) {
      products[index] = updatedProduct;
      await writeJsonFile(filePath, products);
      res.send("Продукт оновлено успішно");
    } else {
      res.status(404).send("Продукт не знайдено");
    }
  } catch (err) {
    console.error("Помилка", err);
    res.status(500).send("Внутрішня помилка");
  }
}

module.exports = updateProduct;
