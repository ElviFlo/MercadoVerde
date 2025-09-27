"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_repository_impl_1 = require("../repositories/product.repository.impl");
const CreateProduct_1 = require("../../application/use-cases/CreateProduct");
const GetAllProducts_1 = require("../../application/use-cases/GetAllProducts");
const GetProductById_1 = require("../../application/use-cases/GetProductById");
const UpdateProduct_1 = require("../../application/use-cases/UpdateProduct");
const DeleteProduct_1 = require("../../application/use-cases/DeleteProduct");
const AuthMiddleware_1 = require("../middlewares/AuthMiddleware");
const router = (0, express_1.Router)();
const repo = new product_repository_impl_1.InMemoryProductRepository();
const create = new CreateProduct_1.CreateProduct(repo);
const getAllProducts = new GetAllProducts_1.GetAllProducts(repo);
const getById = new GetProductById_1.GetProductById(repo);
const update = new UpdateProduct_1.UpdateProduct(repo);
const deleteCase = new DeleteProduct_1.DeleteProduct(repo);
router.post("/", AuthMiddleware_1.authenticateToken, async (req, res) => {
    try {
        const product = await create.execute(req.body);
        res.status(201).json(product);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
router.get("/", async (_req, res) => {
    const products = await getAllProducts.execute();
    res.json(products);
});
router.get("/:id", async (req, res) => {
    try {
        const product = await getById.execute(req.params.id);
        res.json(product);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
});
router.put("/:id", AuthMiddleware_1.authenticateToken, async (req, res) => {
    try {
        const dto = Object.assign({ id: req.params.id }, req.body);
        const product = await update.execute(dto);
        res.json(product);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
router.delete("/:id", AuthMiddleware_1.authenticateToken, async (req, res) => {
    try {
        await deleteCase.execute(req.params.id);
        res.status(204).send();
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
});
exports.default = router;
//# sourceMappingURL=ProductController.js.map