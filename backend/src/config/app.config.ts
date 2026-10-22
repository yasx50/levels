import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  },
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5500'],
    credentials: true,
  },
  upload: { maxFileSizeMB: 10 },
}));