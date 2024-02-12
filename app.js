const express = require("express");
const fs = require("fs/promises");

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

module.exports = app;
