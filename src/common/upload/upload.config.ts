import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

export const multerOptions = (folder: string) => ({
  storage: diskStorage({
    destination: (req, file, cb) => {
      const path = `./uploads/${folder}`;

      fs.mkdirSync(path, { recursive: true });

      cb(null, path);
    },

    filename: (req, file, cb) => {
      const uniqueName =
        Date.now() +
        '-' +
        Math.round(Math.random() * 1e9);

      cb(
        null,
        uniqueName + extname(file.originalname),
      );
    },
  }),
});