import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

import { cloudinary, configureCloudinary } from './cloudinary.config.js';
import {
  ALLOWED_IMAGE_TYPES,
  CloudinaryUploadResult,
} from './cloudinary.types.js';

export const MAX_AVATAR_SIZE = 2 * 1024 * 1024;

export type AvatarFile = {
  mimetype: string;
  size: number;
  buffer: Buffer;
};

export async function uploadAvatar(
  file: AvatarFile,
): Promise<CloudinaryUploadResult> {
  if (!file) {
    throw new BadRequestException('Avatar image is required');
  }

  if (
    !ALLOWED_IMAGE_TYPES.includes(
      file.mimetype as (typeof ALLOWED_IMAGE_TYPES)[number],
    )
  ) {
    throw new BadRequestException('Only JPEG, PNG and WebP images are allowed');
  }

  if (file.size > MAX_AVATAR_SIZE) {
    throw new BadRequestException('Avatar image must be 2 MB or smaller');
  }

  try {
    configureCloudinary();

    const result = await cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
      {
        folder: 'avatars',
        resource_type: 'image',
        transformation: [
          {
            width: 400,
            height: 400,
            crop: 'fill',
            gravity: 'face',
          },
        ],
      },
    );

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error: unknown) {
    console.error('Cloudinary upload failed:', error);

    throw new InternalServerErrorException(
      'Unable to upload avatar to Cloudinary',
    );
  }
}
