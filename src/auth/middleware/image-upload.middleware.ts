import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as multer from 'multer';

@Injectable()
export class ImageUploadMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, './uploads') 
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)  
      }
    });

    const upload = multer({
      storage: storage,
      fileFilter: (req, file, cb) => {
        
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 2000000 }  
    }).single('image');

    upload(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          errors: {
            image: {
              msg: err.message,
            },
          },
        });
      }

      next();
    });
  }
}
