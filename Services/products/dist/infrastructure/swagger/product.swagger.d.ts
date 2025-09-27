export declare const productSwagger: {
    openapi: string;
    info: {
        title: string;
        version: string;
        description: string;
    };
    servers: {
        url: string;
        description: string;
    }[];
    components: {
        securitySchemes: {
            bearerAuth: {
                type: string;
                scheme: string;
                bearerFormat: string;
            };
        };
    };
    paths: {
        "/products": {
            get: {
                summary: string;
                tags: string[];
                responses: {
                    "200": {
                        description: string;
                    };
                };
            };
            post: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                properties: {
                                    name: {
                                        type: string;
                                    };
                                    description: {
                                        type: string;
                                    };
                                    price: {
                                        type: string;
                                    };
                                    stock: {
                                        type: string;
                                    };
                                };
                                required: string[];
                            };
                            example: {
                                name: string;
                                description: string;
                                price: number;
                                stock: number;
                            };
                        };
                    };
                };
                responses: {
                    "201": {
                        description: string;
                    };
                    "401": {
                        description: string;
                    };
                };
            };
        };
        "/products/{id}": {
            get: {
                summary: string;
                tags: string[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    "200": {
                        description: string;
                    };
                    "404": {
                        description: string;
                    };
                };
            };
            put: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                            };
                            example: {
                                name: string;
                                price: number;
                            };
                        };
                    };
                };
                responses: {
                    "200": {
                        description: string;
                    };
                    "401": {
                        description: string;
                    };
                };
            };
            delete: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    "204": {
                        description: string;
                    };
                    "401": {
                        description: string;
                    };
                };
            };
        };
    };
    tags: {
        name: string;
        description: string;
    }[];
};
