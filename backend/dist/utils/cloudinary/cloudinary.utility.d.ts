import { CloudinaryUploadResult } from './cloudinary.types.js';
type AvatarFile = {
    mimetype: string;
    size: number;
    buffer: Buffer;
};
export declare function uploadAvatar(file: AvatarFile): Promise<CloudinaryUploadResult>;
export {};
