import { Suspense, lazy, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import api from "./api";
import logo from "./assets/logo192.png";
import FullPageLoading from "./components/shared/FullPageLoading";
import GlobalNotification from "./components/shared/GlobalNotification";
import { useDispatch, useSelector } from "./store/hooks";
import { selectLoggedIn, updateLoggedIn, updateUser } from "./store/timeSlice";

const LoggedInView = lazy(() => import("./components/LoggedInView"));
const CheckInView = lazy(() => import("./components/checkin"));
const AdminView = lazy(() => import("./components/checkin/AdminView"));
const Login = lazy(() => import("./components/login"));
const UserManagement = lazy(() => import("./components/userManagement"));

function App() {
  const [loading, setLoading] = useState(true);
  const loggedIn = useSelector(selectLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    api.auth
      .getUser()
      .then(res => {
        dispatch(updateUser(res.data));
        dispatch(updateLoggedIn(true));
      })
      .catch(() => dispatch(updateLoggedIn(false)))
      .finally(() => setLoading(false));
  }, [dispatch]);

  return (
    <Router>
      <Helmet>
        <link rel="icon" href={logo} />
        <link rel="apple-touch-icon" href={logo} />
      </Helmet>
      <Suspense fallback={<FullPageLoading />}>
        <Routes>
          {loading ? (
            <Route path="" element={<FullPageLoading />} />
          ) : loggedIn ? (
            <Route path="/" element={<LoggedInView />}>
              <Route path="/" element={<CheckInView />} />
              <Route path="/allcheckins" element={<AdminView />} />
              <Route path="/users" element={<UserManagement />} />
            </Route>
          ) : (
            <Route path="/" element={<Login />} />
          )}
        </Routes>
      </Suspense>
      <GlobalNotification />
    </Router>
  );
}

export default App;
