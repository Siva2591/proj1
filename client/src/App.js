import "./App.css";
import LoginPage from "./Pages/LoginPage";
import Cards from "./Pages/Home";
import Process from "./Pages/Process";
import Settings from "./Pages/Settings";
import Protected from "./components/protected";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>

          <Route path="/" element={<LoginPage />} />
        </Routes>
        <div style={{ display: "flex" }}>
         
          <div style={{  width: "100%" }}>
            <Routes>
              <Route
                path="/home"
                element={
                  <Protected>
                    <Cards />
                  </Protected>
                }
              />
              <Route
                path="/tlprocess"
                element={
                  <Protected>
                    <Process />
                  </Protected>
                }
              />
              <Route
                path="/settings"
                element={
                  <Protected>
                    <Settings />
                  </Protected>
                }
              />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;