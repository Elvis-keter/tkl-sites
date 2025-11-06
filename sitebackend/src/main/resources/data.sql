-- select * from dashboard.tasks
CREATE TABLE tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    date DATE,
    assignTo BIGINT,
    FOREIGN KEY (assignTo) REFERENCES users(id) ON DELETE SET NULL
);
-- DROP TABLE dashboard.users
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

-- Deleting a row
DELETE FROM users WHERE id = 1;

-- Creating a temporary table
CREATE TEMPORARY TABLE temp_table AS SELECT * FROM users;

-- Truncating the original table
TRUNCATE TABLE users;

-- Inserting the data back from the temporary table
INSERT INTO users (name, role, actions)
SELECT name, role, actions
FROM temp_table;

-- Dropping the temporary table
DROP TEMPORARY TABLE temp_table;

-- Viewing the updated table
SELECT * FROM users;
