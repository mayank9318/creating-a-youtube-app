import API from "../utils/axiosInstance";

export const getChannelStats = () =>
    API.get("/dashboard/stats");

export const getChannelVideos = () =>
    API.get("/dashboard/videos");
