CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL
);
CREATE TABLE videos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL
);
CREATE TABLE user_progress (
    user_id INTEGER REFERENCES users(id),
    video_id INTEGER REFERENCES videos(id),
    last_position DECIMAL(10, 2) DEFAULT 0,
    is_completed BOOLEAN DEFAULT false,
    PRIMARY KEY (user_id, video_id)
);
INSERT INTO users (username)
VALUES ('test_user');
INSERT INTO videos (title, url)
VALUES ('Video 1', '/videos/Video1.mp4'),
    ('Video 2', '/videos/Video2.mp4'),('Video 3', '/videos/Video3.mp4');