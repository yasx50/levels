declare const _default: (() => {
    port: number;
    jwt: {
        secret: string | undefined;
        expiresIn: string;
    };
    cors: {
        origin: boolean;
    };
    upload: {
        maxFileSizeMB: number;
    };
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    port: number;
    jwt: {
        secret: string | undefined;
        expiresIn: string;
    };
    cors: {
        origin: boolean;
    };
    upload: {
        maxFileSizeMB: number;
    };
}>;
export default _default;
