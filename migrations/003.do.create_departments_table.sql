DROP TABLE IF EXISTS departments;
CREATE TABLE departments (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    _id UUID NOT NULL,
    department_name text NOT NULL 
);