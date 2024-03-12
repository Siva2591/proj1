import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga';

// Initialize Google Analytics
const TRACKING_ID = 'G-T0TQC4PPCN'; // Replace with your own tracking ID
ReactGA.initialize(TRACKING_ID);

const TrackPageViews = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.pageview(location.pathname);
  }, [location]);

  return null;
};

export default TrackPageViews;
