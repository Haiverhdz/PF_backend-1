import { readJsonFile, writeJsonFile } from "../utils/filehadlers.js";
import paths from "../utils/paths.js";
import { generateId } from "../utils/collectionHandle.js";
import { convertToBoolean } from "../utils/converter.js";
import ErrorManager from "./ErrorManager.js";

export default class ProductManager {
    #jsonFilename;
    #products;

    constructor() {
        this.#jsonFilename = "products.json";
    };

    async #findOneById(id) {
        this.#products = await this.getAll();
        const productFound = this.#products.find((item) => item.id === Number(id));

        if (!productFound) {
            throw new ErrorManager("ID no encontrado", 404);
        }

        return productFound;
    }

    async getAll() {
        try {
            this.#products = await readJsonFile(paths.files, this.#jsonFilename);
            return this.#products;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    async getOneById(id) {
        try {
            const productFound = await this.#findOneById(id);
            return productFound;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    ;
    
    async insertOne(data) {
        try {
            const { title, price, currency, description, stock, code, status, category, thumbnail } = data;

            // if (!title || !price || !currency || !description || !stock || !code || status === undefined || !category) {
            //     throw new ErrorManager("Faltan datos obligatorios", 400);
            // }

            const product = {
                id: generateId(await this.getAll()),
                title, 
                price, 
                currency, 
                description, 
                stock, 
                code, 
                status: convertToBoolean(status),
                category,
                thumbnail: [],
            };

            this.#products.push(product);
            await writeJsonFile(paths.files, this.#jsonFilename, this.#products);

            return product;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    };

    async updateOneById(id, data) {
        try {
            const productFound = await this.#findOneById(id);
            const updatedProduct = {
                id: productFound.id,
                title: data.title || productFound.title,
                currency: data.currency || productFound.currency,
                price: data.price ? Number(data.price) : productFound.price,
                description: data.description || productFound.description,
                stock: data.stock ? Number(data.stock) : productFound.stock,
                code: data.code || productFound.code,
                status: data.status !== undefined ? convertToBoolean(data.status) : productFound.status,
                category: data.category || productFound.category,
            };

            const index = this.#products.findIndex((item) => item.id === Number(id));
            this.#products[index] = updatedProduct;
            await writeJsonFile(paths.files, this.#jsonFilename, this.#products);

            return updatedProduct;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    async deleteOneById(id) {
        try {
            await this.#findOneById(id);

            const index = this.#products.findIndex((item) => item.id === Number(id));
            this.#products.splice(index, 1);
            await writeJsonFile(paths.files, this.#jsonFilename, this.#products);
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }
};
