import { createSlice } from "@reduxjs/toolkit"; // https://redux-toolkit.js.org/api/createSlice

const initialState = {  // this is the initial state of the redux store
  mode: "light",
  user: null,
  token: null,
  posts: [],
};

export const authSlice = createSlice({ // this is the slice of the redux store -> think of it as functions that can be called to change the redux store
  name: "auth",
  initialState, // this is the initial state of the redux store
  reducers: { // these are the functions that can be called to change the redux store
    setMode: (state) => { 
      state.mode = state.mode === "light" ? "dark" : "light"; // change dark / light mode of website
    },
    setLogin: (state, action) => { // set user and token in redux store
      state.user = action.payload.user; // payload is the data that is passed to the function
      state.token = action.payload.token; 
    },
    setLogout: (state) => { // set user and token to null in redux store -> this is called when user logs out
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => { // set friends of user in redux store
      if (state.user) { 
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent :(");
      }
    },
    setPosts: (state, action) => { // set posts in redux store
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => { // set single post in redux store
      const updatedPosts = state.posts.map((post) => { // map through all posts and update the post that was edited
        if (post._id === action.payload.post._id) return action.payload.post; // if post id matches the post id that was edited then return the edited post
        return post; // else return the post
      });      
      updatedPosts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      state.posts = updatedPosts; // set posts to updated posts
    }
  },
});

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost } = authSlice.actions; // these are the functions that can be called to change the redux store
export default authSlice.reducer; // this is the reducer that will be used to change the redux store
