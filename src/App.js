import LoyautPage from "./Pages/LoyautPage";
import AuthorizationPage from "./Pages/AuthorizationPage";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./Components/PrivateRoute";
import ErrorPage from "./Pages/ErrorPage";
import RoomPage from "./Pages/RoomPage";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" Component={AuthorizationPage} />
          <Route Component={PrivateRoute}>
            <Route path="/hotel" Component={LoyautPage} />
            <Route path="/room/:roomId" Component={RoomPage} />
          </Route>
          <Route path="*" Component={ErrorPage} />
        </Routes>
      </Router>
      <footer className="footer"> ©2023 </footer>
    </div>
  );
}

export default App;
