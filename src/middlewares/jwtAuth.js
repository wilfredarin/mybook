import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
  // console.log("Checking Authentication in JWTAuthfile");
  const { jwtToken } = req.cookies;
  jwt.verify(jwtToken, process.env.JWT_SECRET, (err, data) => {
    if (err) {
      res.render("index",{userName:req.username,error:"Unauthorized Access! Login to continue"});
    } else {
      req._id = data._id;
      req.username = data.user.name;
      next();
    }
  });
};
