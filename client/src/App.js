import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom"; // for routing
import MergeLoginPage from "scenes/mergeLoginPage"; // for login page
import SubmissionPage from "scenes/submissionPage"; // for submission page
import NewsFeed from "scenes/newsFeed";
import { useMemo } from "react"; // for memoization
import { useSelector } from "react-redux"; // for getting state from redux
import { CssBaseline, ThemeProvider } from "@mui/material"; // for material ui
import { createTheme } from "@mui/material/styles"; // for material ui
import { themeSettings } from "./theme"; // for theme settings (light and dark mode) -> created in theme.js
import MergeTokenPage from "scenes/tokenPage";
import MergeWebinarPage from "scenes/webinarPage";
import MergeProfilePage from "scenes/mergeProfilePage";
import MergeDirectMessages from "scenes/mergeDirectMessages";
import MergeMyIdeasPage from "scenes/mergeMyIdeasPage";
import MergeMyApplicationsPage from "scenes/mergeMyApplicationsPage";
// import {ChatContextProvider} from "./components/ChatContext";
// import { useDispatch } from "react-redux"; // useDispatch used for dispatching actions to redux store
// import { setError } from "state"; // setError is an action from state.js

function App() {
  const mode = useSelector((state) => state.mode); // will use useSelector to get information from local storage
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]); // will use useMemo to memoize the theme so that it will not be re-rendered every time the mode changes
  const isAuth = Boolean(useSelector((state) => state.token)); // to check if the user is authenticated
  // const dispatch = useDispatch(); // we will use dispatch to dispatch actions to redux store

  // dispatch(
  //   setError({ 
  //     error: null,
  //   })
  // ); // if the user is not logged in then we will dispatch setError action to redux store

  return (
    <div className="app">
      <BrowserRouter> {/* BrowserRouter is the router that we will use for our app */}
        <ThemeProvider theme={theme}> {/* to set the theme for our app */}
          <CssBaseline /> {/* to reset the css and use the theme */}
          <Routes>
            <Route path="/" element={<Navigate to="/mergeLogin" />} /> {/* Redirects to /mergeLogin */}
            <Route path="/mergeLogin" element={<MergeLoginPage />} /> {/* if the path is / then render the LoginPage component */}
            <Route /* if the path is /submission then render the SubmissionPage component */
              path="/submission/:userId"
              element={isAuth ? <SubmissionPage /> : <Navigate to="/" />}
            />
            <Route /* if the path is /token then render the MergeTokenPage component */
              path="/token/:userId"
              element={isAuth ? <MergeTokenPage /> : <Navigate to="/" />}
            />
            <Route /* if the path is /webinar then render the MergeWebinarPage component */
              path="/webinar/:userId"
              element={isAuth ? <MergeWebinarPage /> : <Navigate to="/" />}
            />
            <Route /* if the path is /submission then render the SubmissionPage component */
              path="/newsfeed"
              element={isAuth ? <NewsFeed /> : <Navigate to="/mergeLogin" />}
            />
            <Route /* if the path is /submission then render the SubmissionPage component */
              path="/mergeProfilePage/:userId"
              element={isAuth ? <MergeProfilePage /> : <Navigate to="/mergeLogin" />}
            />
            <Route /* if the path is /submission then render the SubmissionPage component */
                path="/mergeDirectMessages/:userId"
                element={isAuth ? <MergeDirectMessages /> : <Navigate to="/mergeLogin" />}
            />
            <Route /* if the path is /mergeMyIdeasPage then render the ProfilePage component */
              path="/mergeMyIdeas"
              element={isAuth ? <MergeMyIdeasPage /> : <Navigate to="/mergeLogin" />}
            />
            <Route /* if the path is /mergeMyIdeasPage then render the ProfilePage component */
              path="/mergeMyApplications"
              element={isAuth ? <MergeMyApplicationsPage /> : <Navigate to="/mergeLogin" />}
            />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
