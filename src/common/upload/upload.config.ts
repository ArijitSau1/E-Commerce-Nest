import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

const imageFileFilter = (req: any, file: Express.Multer.File, cb: Function) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      new BadRequestException('Only JPG, PNG and WEBP images are allowed.'),
      false,
    );
  }

  cb(null, true);
};

export const multerOptions = (folder: string) => ({
  storage: diskStorage({
    destination: (req, file, cb) => {
      const path = `./uploads/${folder}`;

      fs.mkdirSync(path, { recursive: true });

      cb(null, path);
    },

    filename: (req, file, cb) => {
      const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);

      cb(null, uniqueName + extname(file.originalname));
    },
  }),

  fileFilter: imageFileFilter,

  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB
  },
});
