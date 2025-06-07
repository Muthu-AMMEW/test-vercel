import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
const storage = new GridFsStorage({
    url: process.env.DB_STORAGE_URI,
    file: (req, file) => {
        return {
            filename: file.originalname,
            bucketName: 'userImages', // collection name
        };
    },
});

export const userUpload = multer({ storage });