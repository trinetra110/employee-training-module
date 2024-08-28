import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const VideoPlayer = () => {
  const { id } = useParams();
  const videoRef = useRef(null);
  const [videoData, setVideoData] = useState(null);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch video data including title and last watched position
    fetch(`http://localhost:5000/api/videos/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setVideoData(data);
        setProgress(data.last_position || 0);
      });
  }, [id]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      // Set the initial playback position
      videoElement.currentTime = progress;

      // Prevent seeking forward
      const preventSeek = () => {
        if (videoElement.currentTime > progress) {
          videoElement.currentTime = progress;
        }
      };

      // Update progress on time update
      const updateProgress = () => {
        const currentTime = videoElement.currentTime;
        fetch(`http://localhost:5000/api/progress`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ videoId: id, lastPosition: currentTime }),
        });
        setProgress(currentTime);
      };

      // Handle video end
      const handleEnd = () => {
        fetch(`http://localhost:5000/api/progress`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            videoId: id,
            lastPosition: videoElement.duration,
            isCompleted: true,
          }),
        }).then(() => navigate("/"));
      };

      videoElement.addEventListener("seeking", preventSeek);
      videoElement.addEventListener("timeupdate", updateProgress);
      videoElement.addEventListener("ended", handleEnd);

      return () => {
        videoElement.removeEventListener("seeking", preventSeek);
        videoElement.removeEventListener("timeupdate", updateProgress);
        videoElement.removeEventListener("ended", handleEnd);
      };
    }
  }, [progress, id, navigate]);

  return (
    <div>
      {videoData ? (
        <div>
          <h2>{videoData.title}</h2>
          <div data-vjs-player>
            <video
              ref={videoRef}
              className="video-js vjs-default-skin"
              controls
              preload="auto"
            >
              <source src={videoData.url} type="video/mp4" />
            </video>
          </div>
        </div>
      ) : (
        <p>Loading video...</p>
      )}
    </div>
  );
};

export default VideoPlayer;
