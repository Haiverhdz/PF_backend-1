import { readJsonFile, writeJsonFile } from "../utils/filehadlers.js";
import paths from "../utils/paths.js";
import { generateId } from "../utils/collectionHandle.js";
import ErrorManager from "./ErrorManager.js";

export default class CartManager {
    #jsonFilename;
    #carts;

    constructor() {
        this.#jsonFilename = "cart.json";
    };

    async #findOneById(id) {
        this.#carts = await this.getAll();
        const cartFound = this.#carts.find((item) => item.id === Number(id));

        if (!cartFound) {
            throw new ErrorManager("ID no encontrado", 404);
        }

        return cartFound;
    }

    async getAll() {
        try {
            this.#carts = await readJsonFile(paths.files, this.#jsonFilename);
            return this.#carts;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    async getOneById(id) {
        try {
            const cartFound = await this.#findOneById(id);
            const products = cartFound;
            return products;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    async createOne() {
        try {
            const cart = {
                id: generateId(await this.getAll()),
                products: []
            };

            this.#carts.push(cart);
            await writeJsonFile(paths.files, this.#jsonFilename, this.#carts);

            return cart;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    async addProductOneById(product, cart) {
        try {
            const cartFound = await this.#findOneById(cart);
            if (!cartFound) {
                throw new ErrorManager(error.message, error.code);
            }
            const newProduct = {
                id: product,
                quantity: 1,
            };

            cartFound.products.push(newProduct);
            await writeJsonFile(paths.files, this.#jsonFilename, this.#carts);

            return cartFound;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

};
