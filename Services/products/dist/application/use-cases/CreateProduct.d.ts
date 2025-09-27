import { Product } from "../../domain/entities/Product";
import { IProductRepository } from "../../domain/repositories/IProductRepository";
interface CreateProductDTO {
    name: string;
    description?: string;
    price: number;
    stock?: number;
}
export declare class CreateProduct {
    private productRepository;
    constructor(productRepository: IProductRepository);
    execute(data: CreateProductDTO): Promise<Product>;
}
export {};
