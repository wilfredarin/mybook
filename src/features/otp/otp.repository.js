export const verifyOTPRepo = async(email)=>{
    //get the latest otp created!
    const response = await OTPModel.find({ email }).sort({ createdAt: -1 }).limit(1);
    if (response.length === 0 || otp !== response[0].otp) {
      return {
        success: false,
        message: 'The OTP is not valid',
      };
    }
    return {
        success: true,
        message: 'The OTP is Correct',
      };
}