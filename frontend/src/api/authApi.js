import API from "../utils/axiosInstance";

export const loginUser = (credentials) =>
    API.post("/user/login", credentials);

export const registerUser = (formData) =>
    API.post("/user/register", formData);

export const logoutUser = () =>
    API.post("/user/logout");

export const refreshToken = (refreshToken) =>
    API.post("/user/refresh-token", { refreshToken });
