import { Suspense } from "react";
import { Helmet } from "react-helmet";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import logo from "./assets/logo192.png";
import LoggedInView from "./components/LoggedInView";
import CheckInView from "./components/checkin";
import FullPageLoading from "./components/shared/FullPageLoading";
import GlobalNotification from "./components/shared/GlobalNotification";

function App() {
  return (
    <Router>
      <Helmet>
        <link rel="icon" href={logo} />
        <link rel="apple-touch-icon" href={logo} />
      </Helmet>
      <Suspense fallback={<FullPageLoading />}>
        <Routes>
          <Route path="/" element={<LoggedInView />}>
            <Route path="/" element={<CheckInView />} />
          </Route>
        </Routes>
      </Suspense>
      <GlobalNotification />
    </Router>
  );
}

export default App;
