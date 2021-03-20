import mongoose from "mongoose";
import crypto from 'crypto';
import path from 'path';
import GridFsStorage from "multer-gridfs-storage";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config()



const connect = await mongoose.connect(process.env.CONNECTION_URI,
    { useNewUrlParser: true, useUnifiedTopology: true });

const storage = new GridFsStorage({ db: connect,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err)
                    return reject(err);
                const fileName = `${buf.toString('hex')}${path.extname(file.originalname)}`
                const fileInfo = {
                    filename: fileName,
                    bucketName: 'media'
                }
                resolve(fileInfo)
            })
        })
    }
})

export const gfs = new mongoose.mongo.GridFSBucket(connect.connection.db, {
    bucketName: "media"
})
export const upload = multer({ storage })
