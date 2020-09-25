DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    _id UUID NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL
);