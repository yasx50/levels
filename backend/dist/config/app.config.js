import { registerAs } from '@nestjs/config';
export default registerAs('app', () => ({
    port: parseInt(process.env.PORT ?? '3000', 10),
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
    },
    cors: { origin: true },
    upload: { maxFileSizeMB: 10 },
}));
//# sourceMappingURL=app.config.js.map