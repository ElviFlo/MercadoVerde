import { IProductRepository } from "../../domain/repositories/IProductRepository";
export declare class DeleteProduct {
    private productRepository;
    constructor(productRepository: IProductRepository);
    execute(id: string): Promise<void>;
}
