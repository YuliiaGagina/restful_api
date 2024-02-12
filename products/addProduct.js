const { readJsonFile, writeJsonFile, filePath } = require("./utils");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

// Функція для додавання нового продукту
async function addProduct(req, res) {
  try {
    const newProduct = req.body;

    newProduct.id = uuidv4();

    const products = await readJsonFile(filePath);

    products.push(newProduct);

    await writeJsonFile(filePath, products);

    res.send("Продукт додано");
  } catch (err) {
    console.error("Помилка при додаванні:", err);
    res.status(500).send("помилка сервера");
  }
}

module.exports = addProduct;
