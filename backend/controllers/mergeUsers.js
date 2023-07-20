import MergeUser from "../models/MergeUser.js"; // import User model

export const updateUserCoins = async (req, res) => {
  try {
    const { userId } = req.params; // get id from request parameters
    const { mergeCoins } = req.body; // get coins from request body
    // console.log(userId);
    const user = await MergeUser.findById(userId); // find user by id
    user.mergeCoins = mergeCoins; // set user coins to coins
    await user.save(); // save user to database
    delete user.password; // delete password from user object to not send it as response
    res.status(200).json({user}); // return user
  } catch (err) {
    res.status(404).json({ message: err.message }); // return error message
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
/* READ */
export const getMergeUser = async (req, res) => {
	try {
    const { id } = req.params; // get id from request parameters
    const mergeUser = await MergeUser.findById(id); // find user by id
    res.status(200).json(mergeUser); // return user
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getMergeUserFriends = async (req, res) => {
  try {
    const { id } = req.params; // get id from request parameters
    const mergeUser = await MergeUser.findById(id); // find user by id

    const mergeFriends = await Promise.all( // get all friends of user
      mergeUser.friends.map((id) => MergeUser.findById(id)) // map through friends array and find each friend by id
    );
    if(mergeFriends.length == 0) return res.status(200).json([]); // if user has no friends return empty array
    const formattedMergeFriends = mergeFriends.map( // format for frontend
      ({ _id, name, surname, trustPoints, picturePath }) => { // destructure user object
        return { _id, name, surname, trustPoints, picturePath }; // return formatted user object
      }
    );
    res.status(200).json(formattedMergeFriends); // return formatted friends
  } catch (err) {
    res.status(404).json({ message: err.message }); // return error message
  }
};

/* UPDATE */
export const addRemoveMergeFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params; // get id and friendId from request parameters
    const user = await MergeUser.findById(id); // find user by id
    const friend = await MergeUser.findById(friendId); // find friend by id

    // like toggle
    if (user.friends.includes(friendId)) { // if user already has that friend
      user.friends = user.friends.filter((id) => id !== friendId); // remove friend from user friends
      friend.friends = friend.friends.filter((id) => id !== id); // remove user from friend friends
    } else { // if user does not have that friend
      user.friends.push(friendId); // add friend to user friends
      friend.friends.push(id); // add user to friend friends
    }
    await user.save(); // save user to database
    await friend.save(); // save friend to database

    const friends = await Promise.all( // get all friends of user
      user.friends.map((id) => MergeUser.findById(id)) // map through friends array and find each friend by id
    );
		const formattedMergeFriends = friends.map( // format for frontend
		({ _id, name, surname, trustPoints, picturePath }) => { // destructure user object
			return { _id, name, surname, trustPoints, picturePath }; // return formatted user object
		}
	);

    res.status(200).json(formattedMergeFriends); // return formatted friends
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const rateUser = async (req, res) => {
  const { userId } = req.params; // YENI ID
  const { rating } = req.body;
  const { loggedInUserId } = req.body; // TUKO ID
  
  try {
    // Get the user being rated
    const ratedUser = await MergeUser.findById(userId); // YENI
    if (!ratedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the current user has already rated the user
    const currentUser = await MergeUser.findById(loggedInUserId); // TUKO
    if (currentUser.ratedUsers.indexOf(userId) !== -1) {
      return res.status(400).json({ message: "User has already been rated" });
    }
    
    // Update the rating and trustPointViewCount
    ratedUser.trustPointViewCount++;
    ratedUser.trustPoints = (ratedUser.trustPoints * (ratedUser.trustPointViewCount - 1) + rating) / ratedUser.trustPointViewCount;
    ratedUser.trustPoints = Number(ratedUser.trustPoints.toFixed(1));

    // Save the changes
    await ratedUser.save();

    // Update the current user's ratedUsers array
    currentUser.ratedUsers.push(String(userId));
    await currentUser.save();

    res.status(200).json(currentUser); // return the updated rated user YENI
  } catch (err) {
    res.status(500).json({ message: err.message }); // return error message
  }
};