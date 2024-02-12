const fs = require("fs").promises;
const path = require("path");

// Так як функції зчитування файлу за запису його ми викопистовуємо постійно,
//     я вивела ії в окремий файл для зручного використання,

const filePath = path.join(__dirname, "products.json");

async function readJsonFile(filePath) {
  try {
    const jsonData = await fs.readFile(filePath, "utf8");
    return JSON.parse(jsonData);
  } catch (err) {
    console.error("Помилка читання файлу:", err);
    return null;
  }
}

async function writeJsonFile(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    console.log("Дані успішно записані у файл");
  } catch (err) {
    console.error("Помилка запису у файл:", err);
  }
}

module.exports = {
  readJsonFile,
  writeJsonFile,
  filePath,
};
