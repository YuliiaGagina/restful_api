const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const productsOperations = require("./products");

app.get("/products", productsOperations.getAll);
app.get("/products/:id", productsOperations.getById);
app.put("/products/:id", productsOperations.updateProduct);
app.delete("/products/:id", productsOperations.deleteProduct);
app.post("/products", productsOperations.addProduct);
app.put("/products", productsOperations.rewriteProducts);

const dataDir = path.join(__dirname, "data");

const isValidFilename = (filename) => {
  return /^[a-zA-Z0-9_-]+$/.test(filename);
};

// валідація
const validateFilename = (req, res, next) => {
  const { filename } = req.params;
  if (!isValidFilename(filename)) {
    return res.status(400).send("Invalid filename");
  }
  next();
};

//створення нового файлу
app.post("/files", async (req, res) => {
  try {
    const { filename, data } = req.body;
    if (!filename || !data) {
      return res.status(400).send("Filename and data are required");
    }
    if (!isValidFilename(filename)) {
      return res.status(400).send("Invalid filename");
    }
    await fs.writeFile(
      path.join(dataDir, `${filename}.json`),
      JSON.stringify(data)
    );
    res.status(201).send("File created successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// отримання всіх файлів
app.get("/files", async (req, res) => {
  try {
    const files = await fs.readdir(dataDir);
    res.json(files.map((file) => path.basename(file, ".json")));
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

//  отримати файл і його зміст
app.get("/files/:filename", validateFilename, async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(dataDir, `${filename}.json`);
    const fileContent = await fs.readFile(filePath, "utf-8");
    res.json(JSON.parse(fileContent));
  } catch (err) {
    console.error(err);
    if (err.code === "ENOENT") {
      res.status(404).send("File not found");
    } else {
      res.status(500).send("Internal Server Error");
    }
  }
});

// оновити зміст всередині файлу
app.put("/files/:filename", validateFilename, async (req, res) => {
  try {
    const { filename } = req.params;
    const { data } = req.body;
    if (!data) {
      return res.status(400).send("Data is required");
    }
    await fs.writeFile(
      path.join(dataDir, `${filename}.json`),
      JSON.stringify(data)
    );
    res.send("File updated successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// видалити файл
app.delete("/files/:filename", validateFilename, async (req, res) => {
  try {
    const { filename } = req.params;
    await fs.unlink(path.join(dataDir, `${filename}.json`));
    res.send("File deleted successfully");
  } catch (err) {
    console.error(err);
    if (err.code === "ENOENT") {
      res.status(404).send("File not found");
    } else {
      res.status(500).send("Internal Server Error");
    }
  }
});

module.exports = app;
