const { readJsonFile, writeJsonFile, filePath } = require("./utils");
const path = require("path");

// функція для видалення товару за id

async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const products = await readJsonFile(filePath);
    const index = products.findIndex((p) => p.id === id);

    if (index !== -1) {
      products.splice(index, 1);
      await writeJsonFile(filePath, products);
      res.send("Продукт видалено успішно");
    } else {
      res.status(404).send("Продукт не знайдено");
    }
  } catch (err) {
    console.error("Помилка при видаленні:", err);
    res.status(500).send("Внутрішня помилка");
  }
}

module.exports = deleteProduct;
