import User from "../models/User.js"; // import User model

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params; // get id from request parameters
    const user = await User.findById(id); // find user by id
    res.status(200).json(user); // return user
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params; // get id from request parameters
    const user = await User.findById(id); // find user by id

    const friends = await Promise.all( // get all friends of user
      user.friends.map((id) => User.findById(id)) // map through friends array and find each friend by id
    );
    const formattedFriends = friends.map( // format for frontend
      ({ _id, firstName, lastName, occupation, location, picturePath }) => { // destructure user object
        return { _id, firstName, lastName, occupation, location, picturePath }; // return formatted user object
      }
    );
    res.status(200).json(formattedFriends); // return formatted friends
  } catch (err) {
    res.status(404).json({ message: err.message }); // return error message
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params; // get id and friendId from request parameters
    const user = await User.findById(id); // find user by id
    const friend = await User.findById(friendId); // find friend by id

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
      user.friends.map((id) => User.findById(id)) // map through friends array and find each friend by id
    );
    const formattedFriends = friends.map( // format for frontend
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends); // return formatted friends
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
