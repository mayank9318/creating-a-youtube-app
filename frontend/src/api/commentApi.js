import API from "../utils/axiosInstance";

export const getVideoComments = (videoId, params = {}) =>
    API.get(`/comment/${videoId}`, { params });

export const addComment = (videoId, content) =>
    API.post(`/comment/${videoId}`, { content });

export const updateComment = (commentId, content) =>
    API.patch(`/comment/c/${commentId}`, { content });

export const deleteComment = (commentId) =>
    API.delete(`/comment/c/${commentId}`);
