export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export type CloudinaryImageType =
  (typeof ALLOWED_IMAGE_TYPES)[number];

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
}