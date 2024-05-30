-- both test users have the password "password"

INSERT INTO users (id, username, password, email, is_admin)
VALUES (1,
        'testuser1',
        '$argon2id$v=19$m=65536,t=3,p=4$hhZXak0/rdnXJp74dqwRYQ$hbjKzPh6s5UIr4hXZuF/ZVLwACb9jNhMeTYH8cGgFeU',
        'testuser1@email.com',
        FALSE),
        (2,
        'testuser2',
        '$argon2id$v=19$m=65536,t=3,p=4$hhZXak0/rdnXJp74dqwRYQ$hbjKzPh6s5UIr4hXZuF/ZVLwACb9jNhMeTYH8cGgFeU',
        'testuser2@email.com',
        TRUE);
