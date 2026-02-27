import API from "../utils/axiosInstance";

export const toggleSubscription = (channelId) =>
    API.post(`/subscription/c/${channelId}`);

export const getSubscribedChannels = (channelId) =>
    API.get(`/subscription/c/${channelId}`);

export const getUserChannelSubscribers = (subscriberId) =>
    API.get(`/subscription/u/${subscriberId}`);
