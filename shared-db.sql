CREATE TABLE IF NOT EXISTS hosting_checks (
    id INT NOT NULL PRIMARY KEY,
    description VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT INTO hosting_checks (id, description)
VALUES (1, 'InfinityFree MySQL connected')
ON DUPLICATE KEY UPDATE description = VALUES(description);
