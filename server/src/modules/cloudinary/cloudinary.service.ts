import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

export interface UploadFile {
  buffer: Buffer;
  originalname?: string;
  mimetype?: string;
  size?: number;
}

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME') || 'dim9ktzis',
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY') || '681919433738269',
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET') || 'yzQeV2x0RqxUYijLC6oYv5fppUo',
    });
  }

  async uploadImage(file: UploadFile, folder = 'efchamps/disputes'): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result?.secure_url || result?.url || '');
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  async uploadMultipleImages(files: UploadFile[], folder = 'efchamps/disputes'): Promise<string[]> {
    const uploadPromises = files.map((file) => this.uploadImage(file, folder));
    return Promise.all(uploadPromises);
  }
}
