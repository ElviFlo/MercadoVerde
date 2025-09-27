export declare class Product {
    id: string;
    name: string;
    description: string | null;
    price: number;
    stock: number;
    createdAt: Date;
    updatedAt?: Date | undefined;
    constructor(id: string, name: string, description: string | null, price: number, stock: number, createdAt?: Date, updatedAt?: Date | undefined);
}
