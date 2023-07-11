import { createSlice } from "@reduxjs/toolkit"; // https://redux-toolkit.js.org/api/createSlice

const initialState = {  // this is the initial state of the redux store
  mode: "light",
  user: null,
  token: null,
  posts: [],
  coins: [],
  webinars: [],
  webinar: null, 
  userWebinars: [],
  coinCounts: {},
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
    setUser: (state, action) => {
      state.user = action.payload.user;
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
      updatedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      state.posts = updatedPosts; // set posts to updated posts
    },

    setSubmissions: (state, action) => { // set posts in redux store
      state.posts = action.payload.posts;
    },
    setSubmission: (state, action) => { // set single post in redux store
      const updatedPosts = state.posts.map((post) => { // map through all posts and update the post that was edited
        if (post._id === action.payload.post._id) return action.payload.post; // if post id matches the post id that was edited then return the edited post
        return post; // else return the post
      });      
      updatedPosts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      state.posts = updatedPosts; // set posts to updated posts
    },

    // setCoins: (state, action) => { // set posts in redux store
    //   state.coins = action.payload.coins;
    // },

    // setCoins: (state, action) => {
    //   state.coins = action.payload.coins;

    //   // initialize coinCounts whenever new coins are set
    //   state.coinCounts = action.payload.coins.reduce((acc, coin) => ({ ...acc, [coin._id]: 1 }), {});
    // },

    // incrementCoinCount: (state, action) => { // added
    //   state.coinCounts[action.payload] += 1;
    // },

    setWebinars: (state, action) => { // set webinars in redux store
      state.webinars = action.payload;
    },

    setWebinar: (state, action) => {
      // console.log("Webinars:", state.webinars);
      // console.log("Action Payload:", action.payload);
    
      const updatedWebinars = state.webinars.map((webinar) => {
        if (webinar.extendedProps._id === action.payload.extendedProps._id) {
          return action.payload;
        }
        return webinar;
      });
      // console.log("Updated Webinars:", updatedWebinars);
    
      return { ...state, webinars: updatedWebinars, webinar: action.payload };
    },
    

    setUserWebinars: (state, action) => {
      state.userWebinars = action.payload;
    },



    setCoins: (state, action) => {
      state.coins = action.payload.coins;
      state.coinCounts = {};
      // Initialize coinCounts for each coin
      action.payload.coins.forEach(coin => {
        if (!state.coinCounts[coin._id]) {
          state.coinCounts[coin._id] = 0; // Initialize count as 1
        }
      });
    },

    incrementCoinCount: (state, action) => {
      const coinId = action.payload;
      if (state.coinCounts.hasOwnProperty(coinId)) {
        state.coinCounts[coinId] += 1;
      } else {
        state.coinCounts[coinId] = 1;
      }
    },
    
    decrementCoinCount: (state, action) => {
      const coinId = action.payload;
      if (state.coinCounts.hasOwnProperty(coinId)) {
        state.coinCounts[coinId] -= 1;
        if (state.coinCounts[coinId] < 0) {
          state.coinCounts[coinId] = 0;
        }
      }
    },

  },
});

// export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost, setSubmissions, setSubmission, setCoins } = authSlice.actions; // these are the functions that can be called to change the redux store
export const { setUser, setMode, setLogin, setLogout, setFriends, setPosts, setPost, setSubmissions, setSubmission, setCoins, incrementCoinCount, decrementCoinCount, setWebinars, setWebinar, setUserWebinars} = authSlice.actions; 

export default authSlice.reducer; // this is the reducer that will be used to change the redux store
