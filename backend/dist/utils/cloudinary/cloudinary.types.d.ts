export declare const ALLOWED_IMAGE_TYPES: readonly ["image/jpeg", "image/png", "image/webp"];
export type CloudinaryImageType = (typeof ALLOWED_IMAGE_TYPES)[number];
export interface CloudinaryUploadResult {
    url: string;
    publicId: string;
}
