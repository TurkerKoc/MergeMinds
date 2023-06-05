import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => { // this is a middleware function that will be used to verify the token sent by the client
  try {
    let token = req.header("Authorization"); // get token from header

    if (!token) { // if no token is found
      return res.status(403).send("Access Denied"); // return access denied
    }

    if (token.startsWith("Bearer ")) { // if token starts with Bearer
      token = token.slice(7, token.length).trimLeft(); // remove Bearer from token
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET); // verify token with secret key
    req.user = verified; // set user to verified token
    next(); // call next middleware -> this will be the controller function that will be called after this middleware
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
