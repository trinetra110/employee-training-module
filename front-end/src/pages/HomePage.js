import React from "react";
import VideoLibrary from "../components/VideoLibrary";
import ProgressTracker from "../components/ProgressTracker";

const HomePage = () => {
  return (
    <div>
      <h1>Employee Training Module</h1>
      <ProgressTracker />
      <VideoLibrary />
    </div>
  );
};

export default HomePage;
