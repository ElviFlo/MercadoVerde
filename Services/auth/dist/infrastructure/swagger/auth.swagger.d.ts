export declare const authSwagger: {
    openapi: string;
    info: {
        title: string;
        version: string;
    };
    paths: {
        "/auth/register": {
            post: {
                summary: string;
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                properties: {
                                    username: {
                                        type: string;
                                    };
                                    password: {
                                        type: string;
                                    };
                                };
                                required: string[];
                            };
                            example: {
                                username: string;
                                password: string;
                            };
                        };
                    };
                };
                responses: {
                    201: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        id: {
                                            type: string;
                                        };
                                        username: {
                                            type: string;
                                        };
                                        password: {
                                            type: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        "/auth/login": {
            post: {
                summary: string;
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                properties: {
                                    username: {
                                        type: string;
                                    };
                                    password: {
                                        type: string;
                                    };
                                };
                                required: string[];
                            };
                            example: {
                                username: string;
                                password: string;
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        token: {
                                            type: string;
                                        };
                                    };
                                };
                                example: {
                                    token: string;
                                };
                            };
                        };
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
    };
};
