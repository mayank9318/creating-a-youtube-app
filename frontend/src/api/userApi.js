import API from "../utils/axiosInstance";

export const getCurrentUser = () =>
    API.get("/user/current-user");

export const updateAccountDetails = (data) =>
    API.patch("/user/update-account", data);

export const updateAvatar = (formData) =>
    API.patch("/user/update-avatar", formData);

export const updateCoverImage = (formData) =>
    API.patch("/user/update-cover", formData);

export const changePassword = (data) =>
    API.post("/user/change-password", data);

export const getChannelProfile = (username) =>
    API.get(`/user/c/${username}`);

export const getWatchHistory = () =>
    API.get("/user/history");
