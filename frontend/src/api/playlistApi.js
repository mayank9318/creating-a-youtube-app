import API from "../utils/axiosInstance";

export const createPlaylist = (data) =>
    API.post("/playlist", data);

export const getPlaylistById = (playlistId) =>
    API.get(`/playlist/${playlistId}`);

export const getUserPlaylists = (userId) =>
    API.get(`/playlist/user/${userId}`);

export const updatePlaylist = (playlistId, data) =>
    API.patch(`/playlist/${playlistId}`, data);

export const deletePlaylist = (playlistId) =>
    API.delete(`/playlist/${playlistId}`);

export const addVideoToPlaylist = (videoId, playlistId) =>
    API.patch(`/playlist/add/${videoId}/${playlistId}`);

export const removeVideoFromPlaylist = (videoId, playlistId) =>
    API.patch(`/playlist/remove/${videoId}/${playlistId}`);
