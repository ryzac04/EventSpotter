
const saveToken = (accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
};

const getToken = (key) => {
    return localStorage.getItem(key);
};

const clearToken = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
};

export { saveToken, getToken, clearToken };