import { BadRequestException, InternalServerErrorException, } from '@nestjs/common';
import { cloudinary } from './cloudinary.config.js';
import { ALLOWED_IMAGE_TYPES, } from './cloudinary.types.js';
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
export async function uploadAvatar(file) {
    if (!file) {
        throw new BadRequestException('Avatar image is required');
    }
    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
        throw new BadRequestException('Only JPEG, PNG and WebP images are allowed');
    }
    if (file.size > MAX_IMAGE_SIZE) {
        throw new BadRequestException('Avatar image must be 2 MB or smaller');
    }
    try {
        const result = await cloudinary.uploader.upload(`data:${file.mimetype};base64,${file.buffer.toString('base64')}`, {
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
        });
        return {
            url: result.secure_url,
            publicId: result.public_id,
        };
    }
    catch {
        throw new InternalServerErrorException('Unable to upload avatar to Cloudinary');
    }
}
//# sourceMappingURL=cloudinary.utility.js.map