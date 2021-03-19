import passport from "../strategies/local.js";
import {upload} from "../gfs_storage.js";
import {apiResponse} from "../helpers.js";



/**
 *@swagger
 * /api/media/uploadImage:
 *   post:
 *     security:
 *     bearerToken: []
 *     summary: Uploads Image
 *     tags: [Media]
 *     requestBody:
 *       required: true
 *       content:
 *          multipart/form-data:
 *              schema:
 *                  type: object
 *                  format: binary
 *                  properties:
 *                      img:
 *                          type: string
 *                          format: binary
 *
 *     responses:
 *       200:
 *         description: returns URL of image
 *       400:
 *         description: bad image buffer was given
 *       401:
 *         description: unauthorized
 *       500:
 *         description: Exception has been raised
 */
export const UploadImage = (router) => {
    router.post("/api/media/uploadImage", upload.single('img'), (req, res) => {
        if (req?.file?.filename) {
        }
    })
}

/**
 * @swagger
 *  /api/media/{filename}:
 *    get:
 *      summary: Returns a URL of a file
 *      tags: [Media]
 *      description: |
 *          Locates a file and serves it to user
 *          This endpoint cannot be tested within swagger as it serves binary data directly back to the client
 *      responses:
 *        "200":
 *          description: returns URL
 *        "404":
 *          description: couldn't find that file.
 */
export const GetMediaURL = (router, gfs) => {
    router.get("/api/media/:filename",  async (req, res) => {
        try {
            gfs.find({ filename: req.params.filename}).toArray((err, files) => {
                if (!files[0] || files.length === 0) {
                    return res.status(404).json(
                        apiResponse({msg: "file_not_found", success: false})
                    )
                }
                const type = files[0].contentType
                if (type === "image/jpeg" || type === "image/png") {
                    gfs.openDownloadStreamByName(req.params.filename).pipe(res)
                }
                else {
                    res.status(400).json(
                        apiResponse({msg: "unsupported_file_type", success: false})
                    )
                }
            })

        }
        catch {
            res.status(500).json(
                apiResponse({msg: "unknown_error", success: false})
            );

        }
    })
}

/**
 *@swagger
 * /api/media/uploadVoice:
 *   post:
 *     security:
 *     bearerToken: []
 *     summary: Uploads Voice Clip
 *     tags: [Media]
 *     requestBody:
 *       required: true
 *       content:
 *          multipart/form-data:
 *              schema:
 *                  type: object
 *                  format: binary
 *                  properties:
 *                      File:
 *                          type: string
 *                          format: binary
 *     responses:
 *       200:
 *         description: returns URL of voice
 *       400:
 *         description: bad image buffer was given
 *       401:
 *         description: unauthorized
 *       500:
 *         description: Exception has been raised
 */
export const UploadVoice = (router, gfs) => {
    router.post("/api/media/uploadVoice",passport.authenticate('jwt', { session: false }),  async (req, res) => {
        const resp = {...responseObj}
        try {
            delete resp.page
            resp.success = false
            resp.msg = "Not yet implemented"
            res.status(501).json(resp)
        }
        catch {
            delete resp.page;
            resp.success = false;
            resp.msg = "unknown_error"
            res.status(500).json(resp);

        }
    })
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UploadImage:

 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UploadVoice:
 *       type: object
 *       required:
 *         - groupId
 *       properties:
 *         groupId:
 *           type: string
 *           description: id of group to delete
 *       example:
 *         groupId: 603fed96d6dfbd1e161d47c2
 */
