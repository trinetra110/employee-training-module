const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;
const { Pool } = require("pg");

//Change the following values or use environment variables
const pool = new Pool({
  user: "your_user",
  host: "your_host",
  database: "your_database",
  password: "your_pass",
  port: your_port,
});

app.use(cors());
app.use(express.json());

app.get("/api/videos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM videos ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/api/videos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM videos WHERE id = $1", [id]);
    const progress = await pool.query(
      "SELECT * FROM user_progress WHERE video_id = $1 AND user_id = $2",
      [id, 1]
    );
    if(progress.rows[0].is_completed==false) {
      const videoData = {
        ...result.rows[0],
        last_position: progress.rows[0]?.last_position || 0,
      };
    } else {
      const videoData = {
        ...result.rows[0],
        last_position: 0,
      };
    }
    
    res.json(videoData);
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/api/progress", async (req, res) => {
  const { videoId, lastPosition, isCompleted = false } = req.body;
  try {
    await pool.query(
      "INSERT INTO user_progress (user_id, video_id, last_position, is_completed) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id, video_id) DO UPDATE SET last_position = $3, is_completed = $4",
      [1, videoId, lastPosition, isCompleted]
    );
    res.sendStatus(200);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/api/progress", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM user_progress WHERE user_id = $1 ORDER BY video_id",
      [1]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/api/progress/percentage", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT COUNT(*) AS completed, (SELECT COUNT(*) FROM videos) AS total FROM user_progress WHERE is_completed = true AND user_id = $1`,
      [1]
    );
    const { completed, total } = result.rows[0];
    const percentage = (completed / total) * 100;
    res.json({ percentage: Math.round(percentage) });
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
