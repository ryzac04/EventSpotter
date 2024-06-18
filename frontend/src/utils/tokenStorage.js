
const TOKEN_KEY = 'ESAppAccessToken';

const saveToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

const clearToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

export { saveToken, getToken, clearToken };