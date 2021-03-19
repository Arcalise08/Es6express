import express from 'express';
import mongoose from "mongoose";
import logger from 'morgan'
import bodyParser from 'body-parser'
import {apiResponse} from "./helpers.js";

import {GetMediaURL, UploadImage, UploadVoice} from "./routes/media.js";
import swagger from "./routes/docs/swagger.js";
import accounts from "./routes/account.js";
import users from "./routes/users.js";

const app = express()

const {db} = mongoose.connection;

const gfs = new mongoose.mongo.GridFSBucket(db, {
    bucketName: "media"
})


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));



//***Swagger Endpoints***\\
app.use(swagger)
////////////\\\\\\\\\\\\\\\

//***Account Endpoints***\\
app.use(accounts);
////////////\\\\\\\\\\\\\\\

//***User Endpoints***\\
app.use(users);
///////////\\\\\\\\\\\\\\

//***Media Endpoints***\\
UploadImage(app, gfs)
UploadVoice(app, gfs)
GetMediaURL(app, gfs)
///////////\\\\\\\\\\\\\\\


//***Error Handler***\\
app.use((req, res, next) => {
    res.status(500).send({errors: [apiResponse({msg: 'Unspecified server error', success: false})]})
})
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`App is listening on ${port}`)
})
