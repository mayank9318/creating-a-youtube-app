import API from "../utils/axiosInstance";

export const toggleVideoLike = (videoId) =>
    API.post(`/like/toggle/v/${videoId}`);

export const toggleCommentLike = (commentId) =>
    API.post(`/like/toggle/c/${commentId}`);

export const toggleTweetLike = (tweetId) =>
    API.post(`/like/toggle/t/${tweetId}`);

export const getLikedVideos = () =>
    API.get("/like/videos");
