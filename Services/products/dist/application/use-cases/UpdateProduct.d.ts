import { IProductRepository } from "../../domain/repositories/IProductRepository";
import { Product } from "../../domain/entities/Product";
interface UpdateProductDTO {
    id: string;
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
}
export declare class UpdateProduct {
    private productRepository;
    constructor(productRepository: IProductRepository);
    execute(data: UpdateProductDTO): Promise<Product>;
}
export {};
