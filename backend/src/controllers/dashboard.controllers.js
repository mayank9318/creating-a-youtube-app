import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    // Get total views and total videos
    const videoStats = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $group: {
                _id: null,
                totalViews: { $sum: "$views" },
                totalVideos: { $count: {} }
            }
        }
    ]);

    // Get total subscribers
    const totalSubscribers = await Subscription.countDocuments({
        channel: userId
    });

    // Get total likes for all videos of the channel
    const totalLikes = await Like.aggregate([
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videoInfo"
            }
        },
        {
            $unwind: "$videoInfo"
        },
        {
            $match: {
                "videoInfo.owner": new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $count: "totalLikes"
        }
    ]);

    const stats = {
        totalViews: videoStats[0]?.totalViews || 0,
        totalSubscribers: totalSubscribers,
        totalVideos: videoStats[0]?.totalVideos || 0,
        totalLikes: totalLikes[0]?.totalLikes || 0
    };

    return res.status(200).json(
        new ApiResponse(200, stats, "Channel stats fetched successfully")
    );
});

const getChannelVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const videos = await Video.find({
        owner: userId
    }).sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, videos, "Channel videos fetched successfully")
    );
});

export {
    getChannelStats,
    getChannelVideos
}
