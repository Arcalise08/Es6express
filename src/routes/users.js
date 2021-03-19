import {Users} from "../models.js";
import passport from '../strategies/local.js';
import {isObjectID, apiResponse} from "../helpers.js";
import express from "express";

const router = express.Router();
/**
 * @swagger
 *  /api/users/{userId}:
 *    get:
 *      summary: Get a user by id
 *      tags: [Users]
 *      parameters:
 *        - in: path
 *          name: userId
 *          schema:
 *            type: string
 *          required: true
 *          description: Id of the user
 *      responses:
 *        "200":
 *          description: A user object
 *        "404":
 *          description: Couldnt find user
 */
router.get("/api/users/:userId",passport.authenticate('jwt', { session: false }),  async (req, res) => {
    const checkUserId = isObjectID(req?.params?.userId)
    if (!req.params.userId || !checkUserId) {
        res.status(400).json(apiResponse({success: false, msg: "invalid_user_id"}));
    }

    let checkUser = null;
    try {
        checkUser = await Users.findOne({_id: req.params.userId});
    }
    catch {
        checkUser = null;
    }

    if (checkUser) {
        const data = {
            username: checkUser.username,
            image: checkUser.image
        }
        res.status(200).json(apiResponse({data}));
    }
    else {
        res.status(404).json(apiResponse({success: false, msg: "user_not_found"}));
    }
})


/**
 *@swagger
 * /api/users/update:
 *   put:
 *     security:
 *     bearerToken: []
 *     summary: Updates User Profile
 *     description: Useful for updating ysernames, emails, phone numbers, passwords, or profile images ONLY
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfile'

 *     responses:
 *       200:
 *         description: Successfully updated profile
 *       404:
 *         description: Could not find user
 *       500:
 *         description: Server exception
 */

router.put("/api/users/update",passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        try {
            const checkUser = await Users.findById(req.user._id);
            if (checkUser) {
                const update = {}
                const errors = [];

                if (req?.body?.username) {
                    const checkAvailable = await Users.findOne({username: req.body.username})
                    if (checkAvailable)
                        errors.push({msg: "username_unavailable"})
                    update.username = req.body.username
                }

                if (req?.body?.email) {
                    const checkAvailable = await Users.findOne({email: req.body.email})
                    if (checkAvailable)
                        errors.push({msg: "email_unavailable"})
                    update.email = req.body.email
                }

                if (req?.body?.password) {
                    const hash = await Users.hashPassword(req.body.password)
                    update.password = hash
                }

                if (req?.body?.image)
                    update.image = req.body.image;

                if (req?.body?.phoneNumber) {
                    const checkAvailable = await Users.findOne({phoneNumber: req.body.phoneNumber})
                    if (checkAvailable)
                        errors.push({msg: "phone_number_unavailable"})
                    update.phoneNumber = req.body.phoneNumber;
                }

                if (errors.length > 0) {
                    res.status(400).json(apiResponse({success: false, data: errors}))
                    return;
                }


                const updatedProfile = await Users.findByIdAndUpdate(req.user._id, update, {
                    new: true
                })

                delete updatedProfile.password
                res.status(200).json(apiResponse({data: updatedProfile}));
            }
            else {
                res.status(404).json(apiResponse({success: false, msg: "user_not_found"}));
            }
        }
        catch(e) {
            console.log(e)
            res.status(500).json(apiResponse({success: false, msg: "server_exception"}));
        }

})



/**
 * @swagger
 *  /api/users/myProfile:
 *    get:
 *      summary: Get own user info
 *      tags: [Users]
 *      responses:
 *        "200":
 *          description: A user object
 *        "404":
 *          description: Couldnt find user
 */


router.get("/api/users/myProfile",passport.authenticate('jwt', { session: false }),  async (req, res) => {
    const checkUser = await Users.findById(req.user._id);
    if (checkUser) {
        const temp = {...checkUser}
        delete temp.password
        res.status(200).json(apiResponse({data: temp}));
    }
    else {
        res.status(404).json(apiResponse({success: false, msg: "user_not_found"}));
    }
})



/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateProfile:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: username to update
 *         password:
 *           type: string
 *           description: password to update
 *         image:
 *           type: string
 *           description: url of profile image
 *         phoneNumber:
 *           type: string
 *           description: phone number to update
 *       example:
 *         username: TestKyle23
 *         password: Test1234!
 *         phoneNumber: 000-000-0000
 *
 */

export default router;
