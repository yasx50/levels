import { CloudinaryUploadResult } from './cloudinary.types.js';
export declare const MAX_AVATAR_SIZE: number;
export type AvatarFile = {
    mimetype: string;
    size: number;
    buffer: Buffer;
};
export declare function uploadAvatar(file: AvatarFile): Promise<CloudinaryUploadResult>;
