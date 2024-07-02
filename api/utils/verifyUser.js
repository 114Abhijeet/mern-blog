import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';
export const verifyToken = (req, res, next) => {
//If you remember we have named the cookie as access_token while sending the response.
  const token = req.cookies.access_token;
  if (!token) {
    return next(errorHandler(401, 'Unauthorized'));
  }
//Based on this JWT_SECRET key we verify the token.Now Suppose another person create the same token in users browser
//we don't want to verify the suspicious user.
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//user--In this we get userdata from cookie(the data which is displayed while pasting tokens in jwt token website)
// id,iat etc
    if (err) {
      return next(errorHandler(401, 'Unauthorized'));
    }
//We want to send send this data along with the request we have body we have cookie so what we want to 
// add is to add the user.The verifyToken middleware verifies the token and adds the user info to the req object.
    req.user = user;
    next(); // Go to updateUser function
  });
};