import { IProductRepository } from "../../domain/repositories/IProductRepository";
import { Product } from "../../domain/entities/Product";
export declare class GetAllProducts {
    private productRepository;
    constructor(productRepository: IProductRepository);
    execute(): Promise<Product[]>;
}
