import { IProductRepository } from "../../domain/repositories/IProductRepository";
import { Product } from "../../domain/entities/Product";
export declare class GetProductById {
    private productRepository;
    constructor(productRepository: IProductRepository);
    execute(id: string): Promise<Product>;
}
