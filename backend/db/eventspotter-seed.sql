-- both users have the password "Password!2"

INSERT INTO users (username, password, email, is_admin, latitude, longitude, street, city, state, post_code, country)
VALUES (
        'username1',
        '$argon2id$v=19$m=65536,t=3,p=4$hXbTt62l+IHN0r6D8Tf8Uw$+HvQWHCDI3YYT+MaON08vkOzMyyQwANeCfIzZrFPaMg',
        'username1@email.com',
        FALSE,
        30.351470,
        -97.556717,
        '12700 Lexington St Suite 100',
        'Manor',
        'TX',
        78653,
        'USA'),
        (
        'username2',
        '$argon2id$v=19$m=65536,t=3,p=4$hXbTt62l+IHN0r6D8Tf8Uw$+HvQWHCDI3YYT+MaON08vkOzMyyQwANeCfIzZrFPaMg',
        'username2@email.com',
        TRUE,
        30.351470,
        -97.556717,
        '12700 Lexington St Suite 100',
        'Manor',
        'TX',
        78653,
        'USA');
