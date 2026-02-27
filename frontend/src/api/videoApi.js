import API from "../utils/axiosInstance";

export const getAllVideos = (params = {}) =>
    API.get("/video", { params });

export const getVideoById = (videoId) =>
    API.get(`/video/${videoId}`);

export const publishVideo = (formData) =>
    API.post("/video", formData);

export const updateVideo = (videoId, formData) =>
    API.patch(`/video/${videoId}`, formData);

export const deleteVideo = (videoId) =>
    API.delete(`/video/${videoId}`);

export const togglePublishStatus = (videoId) =>
    API.patch(`/video/toggle/publish/${videoId}`);
