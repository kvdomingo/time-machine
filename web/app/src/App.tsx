import { Suspense, useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import api from "./api";
import LoggedInView from "./components/LoggedInView";
import CheckInView from "./components/checkin";
import AdminView from "./components/checkin/AdminView";
import Login from "./components/login/Login";
import FullPageLoading from "./components/shared/FullPageLoading";
import GlobalNotification from "./components/shared/GlobalNotification";
import { useDispatch, useSelector } from "./store/hooks";
import { selectLoggedIn, updateLoggedIn, updateUser } from "./store/timeSlice";

function App() {
  const [loading, setLoading] = useState(true);
  const loggedIn = useSelector(selectLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    api.auth
      .getUser()
      .then(res => {
        let { data } = res;
        dispatch(updateLoggedIn(true));
        dispatch(updateUser(data));
      })
      .catch(() => {
        dispatch(updateLoggedIn(false));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  return (
    <Router>
      <Suspense fallback={<FullPageLoading />}>
        <Routes>
          {loading ? (
            <Route path="" element={<FullPageLoading />} />
          ) : loggedIn ? (
            <Route path="/" element={<LoggedInView />}>
              <Route path="/" element={<CheckInView />} />
              <Route path="/allcheckins" element={<AdminView />} />
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
