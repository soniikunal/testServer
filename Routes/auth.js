import express, { application } from "express";
const router = express.Router();
import axios from "axios";
import User from "../Models/UsersModel/OrgUser.js";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import ApplicantSchema from "../Models/UsersModel/ApplicantSchema.js";
import TestScoreSchema from "../Models/AnswerModal/TestScoreSchema.js";
dotenv.config();

//Register
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    orgId: req.body.orgId,
    email: req.body.email,
    team: req.body.team,
    password: req.body.password
      ? CryptoJS.AES.encrypt(
          req.body.password,
          process.env.CRYPTO_KEY
        ).toString()
      : undefined,
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json({ status: true, savedUser });
  } catch (error) {
    handleServerError(res, error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const savedUser = await User.findOne({ username: req.body.username });
    if (savedUser) {
      if (
        CryptoJS.AES.decrypt(
          savedUser.password,
          process.env.CRYPTO_KEY
        ).toString(CryptoJS.enc.Utf8) === req.body.password
      ) {
        const accessToken = jwt.sign(
          {
            id: savedUser._id,
            roles: savedUser.Roles,
          },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "3d",
          }
        );
        const { password, ...others } = savedUser._doc;
        res.status(201).json({ status: true, ...others, accessToken });
      } else {
        res.status(401).json("Wrong Credentials");
      }
    } else {
      res.status(401).json("Wrong Credentials");
    }
  } catch (error) {
    res.status(401).json(error);
  }
});

// router.get('/test', async(req, res)=> {
//   try {
//     res.send('hi')
//   } catch (error) {
//     res.status(401).json(error);
//   }
// })

router.post("/examLogin", async (req, res) => {
  try {
    const { registerId, mailId } = req.body;
    const erpObj = {
      regid: registerId,
      email: mailId,
    };
    const response = await axios.post(
      "https://erp.fusionfirst.com/applicant/verify",
      erpObj
    );

    const erpResponse = response.data;

    if (!erpResponse) {
      return res.status(500).json({
        success: false,
        message: "Server Error",
        applicant: null,
      });
    } else if (erpResponse.success == true && erpResponse.applicant == null) {
      return res.status(201).json({
        erpResponse: {
          success: true,
          message: "Registration Id and Email didn't match!",
          applicant: null,
        },
      });
    } else if (erpResponse.success == true && erpResponse.applicant !== null) {
      let savedApplicant;
      savedApplicant = await ApplicantSchema.findOne({
        AppID: erpResponse.applicant.AppID,
      });
      if (!savedApplicant) {
        const ApplicantData = new ApplicantSchema(erpResponse.applicant);
        savedApplicant = await ApplicantData.save();
      }
      const accessToken = jwt.sign(
        {
          id: savedApplicant.AppID,
          roles: erpResponse.testType,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "1d",
        }
      );
      const TestToAppear = await TestScoreSchema.findOne({
        userId: erpResponse.applicant.AppID,
      }).lean();
      if (TestToAppear) {
        const TestPending = Object.keys(TestToAppear).filter(
          (key) => TestToAppear[key] === null
        );
        return res.status(200).json({ erpResponse, accessToken, TestPending });
      }
      const newUser = await TestScoreSchema.create({
        userId: erpResponse.applicant.AppID,
        name: erpResponse.applicant.name,
      });
      return res.status(200).json({ erpResponse, accessToken, newUser });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
export { router as authRoutes };
