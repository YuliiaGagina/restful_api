const supertest = require("supertest");
const app = require("../app");
const { readJsonFile } = require("./utils");

jest.mock("./utils", () => ({
  readJsonFile: jest.fn(() =>
    Promise.resolve([{ id: "1", name: "Product 1" }])
  ),
}));

describe("GET /products", () => {
  it("should return status code 200 and an array of products", async () => {
    const response = await supertest(app).get("/products");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    expect(response.body[0].name).toBe("Product 1");
  });

  it("should return status code 500 and an error message if reading JSON file fails", async () => {
    jest
      .spyOn(require("./utils"), "readJsonFile")
      .mockRejectedValue(new Error("Failed to read file"));
    const response = await supertest(app).get("/products");
    expect(response.status).toBe(500);
    expect(response.text).toBe("Внутрішня помилка");
  });
});

describe("GET /products/:id", () => {
  it("should return status code 200 and a product with the given id", async () => {
    const response = await supertest(app).get("/products/1");

    expect(response.status).toBe(200);
    expect(response.body.id).toBe("1");
    expect(response.body.name).toBe("Product 1");
  });

  it("should return status code 404 if product with the given id is not found", async () => {
    jest.spyOn(require("./utils"), "readJsonFile").mockResolvedValue([]);
    const response = await supertest(app).get("/products/2");
    expect(response.status).toBe(404);
    expect(response.text).toBe("Продукт не знайдено");
  });

  it("should return status code 500 and an error message if reading JSON file fails", async () => {
    jest
      .spyOn(require("./utils"), "readJsonFile")
      .mockRejectedValue(new Error("Failed to read file"));
    const response = await supertest(app).get("/products/1");
    expect(response.status).toBe(500);
    expect(response.text).toBe("Внутрішня помилка");
  });
});

describe("POST /products", () => {
  it("should add a new product and return status code 200", async () => {
    const newProduct = { name: "New Product", price: 10 };

    const response = await supertest(app).post("/products").send(newProduct);

    expect(response.status).toBe(200);
    expect(response.text).toBe("Продукт додано");
  });

  it("should return status code 500 if an error occurs during addition", async () => {
    const newProduct = { name: "New Product", price: 10 };

    jest
      .spyOn(require("./utils"), "readJsonFile")
      .mockRejectedValue(new Error());

    const response = await supertest(app).post("/products").send(newProduct);

    expect(response.status).toBe(500);
    expect(response.text).toBe("помилка сервера");
  });
});
