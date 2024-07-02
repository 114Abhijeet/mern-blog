import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res,next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === '' ||
    email === '' ||
    password === ''
  ) {
    // return res.status(400).json({ message: 'All fields are required' });
    //Here we didn't have an error actually but we have created this by Javascript error Constructor to manage
    // more efficiently
    next(errorHandler(400, 'All fields are required'));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
 //username:username, -- syntax wise (but after ES6 if key and value is similar we can just write like below code)
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.json('Signup successful');
  } catch (error) {
    //The Error object in JavaScript has a message property. This property contains a human-readable description 
    // of the error.
    // res.status(500).json({ message: error.message });
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === '' || password === '') {
    next(errorHandler(400, 'All fields are required'));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, 'User not found'));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
    //Always use return when calling next with an error inside conditional blocks.
    //This ensures that the function does not continue executing after an error is handled.
      return next(errorHandler(400, 'Invalid password'));
    }
  //It's very safe to have isAdmin in the cookie because it is encrypted and if we see that user is admin we
  //can give them extra privillege like deleting,adding posts etc.So We want to send isAdmin information wraped 
  //with cookie.
    const token = jwt.sign({ id: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET);

    // JavaScript's destructuring assignment with rest properties to exclude the password field from an object
//When you rename the password variable, you avoid conflicts with the previously destructured password from req.body
    // See more in whatsapp mern-blog--Effect of _doc
    const { password: pass, ...rest } = validUser._doc;
    res.status(200)
  // This sets a cookie named 'access_token' with the value of the token variable.(See in Postman in cookie section)
      .cookie('access_token', token, {
  // The httpOnly: true option makes the cookie inaccessible to JavaScript running on the client-side,
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(' ').join('') +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin}, process.env.JWT_SECRET);
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};