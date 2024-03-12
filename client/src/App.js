// import "./App.css";
// import LoginPage from "./Pages/LoginPage";
// import Cards from "./Pages/Home";
// import Process from "./Pages/Process";
// import Settings from "./Pages/Settings";
// import Protected from "./components/protected";
// import {
//   BrowserRouter as Router,
//   Route,
//   Routes,
// } from "react-router-dom";
// function App() {
//   return (
//     <div className="App">
//       <Router>
//         <Routes>

//           <Route path="/" element={<LoginPage />} />
//         </Routes>
//         <div style={{ display: "flex" }}>
         
//           <div style={{  width: "100%" }}>
//             <Routes>
//               <Route
//                 path="/home"
//                 element={
//                   <Protected>
//                     <Cards />
//                   </Protected>
//                 }
//               />
//               <Route
//                 path="/tlprocess"
//                 element={
//                   <Protected>
//                     <Process />
//                   </Protected>
//                 }
//               />
//               <Route
//                 path="/settings"
//                 element={
//                   <Protected>
//                     <Settings />
//                   </Protected>
//                 }
//               />
//             </Routes>
//           </div>
//         </div>
//       </Router>
//     </div>
//   );
// }

// export default App;





import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import ReactGA from 'react-ga';
import LoginPage from './Pages/LoginPage';
import Cards from './Pages/Home';
import Process from './Pages/Process';
import Settings from './Pages/Settings';
import Protected from './components/protected';

// Initialize Google Analytics
const TRACKING_ID = 'G-T0TQC4PPCN'; // Replace with your own tracking ID
ReactGA.initialize(TRACKING_ID);

// Track page views on route changes
const TrackPageViews = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, [location]);

  return null;
};

// Function to track login event
const trackLogin = () => {
  ReactGA.event({
    category: 'User',
    action: 'Logged In'
  });
};

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage onLogin={trackLogin} />} />
          <Route path="*" element={<TrackPageViews />} />
        </Routes>

        <div style={{ display: 'flex' }}>
          <div style={{ width: '100%' }}>
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
