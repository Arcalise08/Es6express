import passport from '../strategies/local.js';
import express from 'express';
import jwt from 'jsonwebtoken';
import {Users} from "../models.js";
import {check, validationResult} from "express-validator";
import {apiResponse} from "../helpers.js";
import dotenv from "dotenv";
dotenv.config()


const jwtSecret = process.env.JWT_SECRET;
const router = express.Router();

function generateJWTToken(user) {
  return jwt.sign(user, jwtSecret, {
    subject: user.username,
    expiresIn: '30d',
    algorithm: 'HS256'
  });
}

const searchUserField = async (userField) => {
  const check = await Users.findOne(userField);
  return !!check;
}

/**
 *@swagger
 * /api/account/login:
 *   post:
 *     security: []
 *     summary: Logs users in
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'

 *     responses:
 *       200:
 *         description: successfully logged in user
 *       400:
 *         description: userName or email incorrect
 */

router.post('/api/account/login', (req, res) => {
  passport.authenticate('local', {session: false}, (error, user, info) => {
    if (error || !user) {
      return res.status(400).json(apiResponse({
        success: false,
        msg: "credentials_mismatch"
      }));
    }

    req.login(user, {session: false}, error => {
      if (error) {
        return res.status(400).json(apiResponse({
          success: false,
          msg: "unknown_login_error"
        }));
      }
      const userJSON = user.toJSON();
      const token = generateJWTToken(userJSON);
      if (!userJSON.isAdmin)
        delete userJSON.isAdmin

      delete userJSON.password;

      return res.status(200).json(apiResponse({
            success: true,
            data: {
              user: userJSON,
              token
            }
          })
      );
    });
  })(req, res)
})

/**
 *@swagger
 * /api/account/register:
 *   post:
 *     security: []
 *     summary: Logs users in
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Register'

 *     responses:
 *       200:
 *         description: successfully logged in user
 *       400:
 *         description: userName or email incorrect
 */

router.post(
    "/api/account/register",
    [check('username', 'Username is required and must be between 4 and 25 characters!').isLength({min: 4, max: 25}),
      check('username', 'Username contains non-alphanumeric characters').isAlphanumeric(),
      check('password', 'Password must be between 4 and 25 characters!').isLength({min: 4, max: 25}),
      check('email', 'Email is not valid').isEmail()
    ], async (req, res) => {
      const validator = validationResult(req);
      const errorArr = [];

      if (validator.errors.length > 0) {
        res.status(400).json(apiResponse({validator}))
        return;
      }

      const userExists = await searchUserField({username: req.body.username});
      const emailExists = await searchUserField({email: req.body.email});

      if (userExists)
        errorArr.push({msg: "username_already_exists", username: req?.body?.username})
      if (emailExists)
        errorArr.push({msg: "email_already_exists", email: req?.body?.email})

      if (errorArr.length > 0) {
        res.status(400).json(apiResponse({data: errorArr, success: false}))
        return;
      }
      try {
        const hashedPassword = Users.hashPassword(req.body.password);
        const { username, email } = req.body;
        const user = await Users.create({
          username,
          email,
          password: hashedPassword
        })
        if (user) {
          res.status(201).json(apiResponse({data: user, success: true}));
        } else {
          res.status(500).json(apiResponse({
            success: false,
            msg:"register_user_not_created"})
          )
        }
      } catch (e) {
        console.log(e)
        res.status(500).json(apiResponse({
          success: false,
          msg:"register_user_exception"})
        )
      }
    })

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Login:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 *       example:
 *         username: TestKyle22
 *         password: Test123!
 *
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     Register:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - email
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 *       example:
 *         username: TestKyle22
 *         password: Test123!
 *         email: TestKyle@gmail.com
 *
 */
