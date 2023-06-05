import bcrypt from "bcrypt"; // for password hashing
import jwt from "jsonwebtoken"; // for generating tokens
import User from "../models/User.js"; // import User model

/* REGISTER USER */
export const register = async (req, res) => { // async function to register user -> it is async we are using await
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body; // get all data from request body

    const salt = await bcrypt.genSalt(); // generate salt for password hashing
    const passwordHash = await bcrypt.hash(password, salt); // hash password with salt

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000), // generate random number for viewed profile
      impressions: Math.floor(Math.random() * 10000), // generate random number for impressions
    }); // create new user with hashed password
    const savedUser = await newUser.save(); // save user to database -> it is async we are using await
    res.status(201).json(savedUser); // send saved user as response
  } catch (err) { 
    if(err.code == 11000 && err.keyPattern && err.keyPattern.email == 1) {
      res.status(409).json({ error: "Email already exists. " }); // if email already exists send error message
    }
    else {
      res.status(500).json({ error: err.message }); // if error send error message as response
    }
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body; // get email and password from request body
    const user = await User.findOne({ email: email }); // find user with email
    if (!user) return res.status(400).json({ msg: "User does not exist. " }); // if user does not exist send error message

    const isMatch = await bcrypt.compare(password, user.password); // compare password with hashed password
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " }); // if password does not match send error message

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); // generate token with user id
    delete user.password; // delete password from user object to not send it as response
    res.status(200).json({ token, user }); // send token and user as response
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message }); // if error send error message as response
  }
};
