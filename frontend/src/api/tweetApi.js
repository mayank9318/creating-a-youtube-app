import API from "../utils/axiosInstance";

export const createTweet = (content) =>
    API.post("/tweet", { content });

export const getUserTweets = (userId) =>
    API.get(`/tweet/user/${userId}`);

export const updateTweet = (tweetId, content) =>
    API.patch(`/tweet/${tweetId}`, { content });

export const deleteTweet = (tweetId) =>
    API.delete(`/tweet/${tweetId}`);
