DROP TABLE IF EXISTS user_meeting;
CREATE TABLE user_meeting (
    user_meeting_pkey INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    user_id int REFERENCES users (user_id) ON DELETE CASCADE,
    meeting_id int REFERENCES meetings (meeting_id) ON DELETE CASCADE
);