import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Comment } from "../models/comment.model.js"
import { Video } from "../models/video.model.js"
import { Tweet } from "../models/tweet.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const alreadyLiked = await Like.findOne({
        video: videoId,
        likedBy: req.user?._id
    });

    if (alreadyLiked) {
        await Like.findByIdAndDelete(alreadyLiked._id);

        return res
            .status(200)
            .json(new ApiResponse(200, { isLiked: false }, "Video unliked successfully"));
    }

    await Like.create({
        video: videoId,
        likedBy: req.user?._id
    });

    return res
        .status(200)
        .json(new ApiResponse(200, { isLiked: true }, "Video liked successfully"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, " invalid Comment ID ");
        
    }
    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404,"Comment not found ");
        
        
    }
    const alreadyLiked = await Like.findOne({
        comment:commentId,
        likedBy: req.user?._id
    });
    if (alreadyLiked) {
        await Like.findByIdAndDelete(alreadyLiked._id)
       
       return res
       .status(200)
       .json(new ApiResponse(200,{isLiked:false},"comment unliked succesfully"))
    }
  await Like.create(
{
    comment:commentId,
    likedBy:req.user?._id
}
  )

  return res
  .status(200)
  .json(new ApiResponse(200,"comment liked successfully  "))

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    const alreadyLiked = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user?._id
    });

    if (alreadyLiked) {
        await Like.findByIdAndDelete(alreadyLiked._id);

        return res
            .status(200)
            .json(new ApiResponse(200, { isLiked: false }, "Tweet unliked successfully"));
    }

    await Like.create({
        tweet: tweetId,
        likedBy: req.user?._id
    });

    return res
        .status(200)
        .json(new ApiResponse(200, { isLiked: true }, "Tweet liked successfully"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user?._id),
                video: { $exists: true, $ne: null }
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        username: 1,
                                        fullName: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: { $first: "$owner" }
                        }
                    },
                    {
                        $project: {
                            title: 1,
                            description: 1,
                            thumbnail: 1,
                            duration: 1,
                            views: 1,
                            owner: 1,
                            createdAt: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                video: { $first: "$video" }
            }
        },
        {
            $match: {
                video: { $exists: true }
            }
        },
        {
            $project: {
                video: 1,
                likedBy: 1
            }
        }
    ]);

    if (!likedVideos?.length) {
        throw new ApiError(404, "No liked videos found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, likedVideos, "Liked videos fetched successfully"));
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}