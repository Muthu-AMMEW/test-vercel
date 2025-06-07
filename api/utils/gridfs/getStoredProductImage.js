import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import Grid from 'gridfs-stream';

let gfs, gridfsBucket;

export const initializeProductGridFS = async () => {
  const conn = await mongoose.createConnection(process.env.DB_STORAGE_URI).asPromise();

  gridfsBucket = new GridFSBucket(conn.db, {
    bucketName: 'productImages'
  });

  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('productImages');
};

export const productGetGFS = () => {
  if (!gfs) throw new Error('GridFS not initialized. Call initializeGridFS() first.');
  return gfs;
};

export const productGetGridFSBucket = () => {
  if (!gridfsBucket) throw new Error('GridFSBucket not initialized. Call initializeGridFS() first.');
  return gridfsBucket;
};

