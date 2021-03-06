DROP TABLE IF EXISTS user_team;
CREATE TABLE user_team (
    user_team_pkey INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    user_id int REFERENCES users (user_id) ON DELETE CASCADE,
    team_id int REFERENCES teams (team_id) ON DELETE CASCADE
);