const { readJsonFile, writeJsonFile, filePath } = require("./utils");
const path = require("path");

// функція на перезапис усіх продуктів

async function rewriteProducts(req, res) {
  try {
    const products = req.body;

    await writeJsonFile(filePath, products);

    res.send("Список продуктів оновлено успішно");
  } catch (err) {
    console.error("Помилка при оновленні списку продуктів:", err);
    res.status(500).send("Внутрішня помилка сервера");
  }
}
module.exports = rewriteProducts;
