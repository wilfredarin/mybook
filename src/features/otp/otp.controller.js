// controllers/otpController.js
import mongoose from 'mongoose';
import otpGenerator from 'otp-generator';
import { otpSchema } from './otp.schema';
import { userSchema } from '../user/user.schema';
import sendEmail from '../../utils/mailSender.js';
const OTPModel = mongoose.model("OTP",otpSchema);
const UserModel = mongoose.model("User",userSchema);

async function sendVerificationEmail(email, otp) {
    try {
      const mailResponse = await sendEmail(
        email,
        "MyBook | Password Reset Request",
        `<h1>Please confirm your OTP</h1>
         <p>Here is your OTP code: ${otp}</p>`
      );
      console.log("Email sent successfully: ", mailResponse);
    } catch (error) {
      console.log("Error occurred while sending email: ", error);
      throw error;
    }
  }

export const sendOTP = async (req, res) => {
    const { email } = req.body;
  try {
    
    const checkUserPresent = await UserModel.findOne({ email });
    // If user found with provided email
    if (!checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: 'User not registered',
      });
    }

    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    let result = await OTPModel.findOne({ otp: otp });

    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
      result = await OTPModel.findOne({ otp: otp });
    }
    const otpPayload = { email, otp };
    const otpBody = await OTPModel.create(otpPayload);

    await sendVerificationEmail(email, otp);
    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      otp,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};