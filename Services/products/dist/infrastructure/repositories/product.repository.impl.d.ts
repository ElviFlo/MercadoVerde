import { IProductRepository } from "../../domain/repositories/IProductRepository";
import { Product } from "../../domain/entities/Product";
export declare class InMemoryProductRepository implements IProductRepository {
    private products;
    create(product: Product): Promise<Product>;
    findAll(): Promise<Product[]>;
    findById(id: string): Promise<Product | null>;
    update(product: Product): Promise<Product>;
    delete(id: string): Promise<void>;
}
