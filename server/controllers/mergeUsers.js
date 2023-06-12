import MergeUser from "../models/MergeUser.js"; // import User model

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
