import mongoose from "mongoose";
import crypto from 'crypto';
import path from 'path';
import GridFsStorage from "multer-gridfs-storage";
import multer from "multer";

// MAKE SURE YOU HAVE A .env FILE IN THE ROOT DIR
//it should use process.env.CONNECTION_URI for mongodb
const dbURL = process.env.CONNECTION_URI;

const connect = await mongoose.connect(dbURL,
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


export const upload = multer({ storage })
