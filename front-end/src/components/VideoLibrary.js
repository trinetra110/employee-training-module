import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const VideoLibrary = () => {
  const [videos, setVideos] = useState([]);
  const [userProgress, setUserProgress] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/videos")
      .then((response) => response.json())
      .then((data) => setVideos(data));

    fetch("http://localhost:5000/api/progress")
      .then((response) => response.json())
      .then((data) => setUserProgress(data));
  }, []);

  return (
    <div>
      <h2>Video Library</h2>
      <ul>
        {videos.map((video, index) => (
          <li key={video.id}>
            {index === 0 || userProgress[index - 1]?.is_completed ? (
              <Link to={`/videos/${video.id}`}>{video.title}</Link>
            ) : (
              <span>{video.title} (Locked)</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VideoLibrary;
