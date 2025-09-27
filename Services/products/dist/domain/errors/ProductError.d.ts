export declare class ProductError extends Error {
    constructor(message: string);
    static notFound(): ProductError;
    static invalidData(): ProductError;
}
