import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Tweet content is required")
    }

    const userId = req.user?._id

    if (!userId) {
        throw new ApiError(401, "Unauthorized request")
    }

    const tweet = await Tweet.create({
        content: content.trim(),
        owner: userId
    })

    if (!tweet) {
        throw new ApiError(500, "Something went wrong while creating tweet")
    }

    return res.status(201).json(new ApiResponse(201, tweet, "Tweet created successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.params
        console.log(userId, "user not thayer")

        // validate userId
        if (!userId || !isValidObjectId(userId)) {
            throw new ApiError(400, "Invalid user id")
        }

        // check if user exists
        const user = await User.findById(userId)
        if (!user) {
            throw new ApiError(404, "User not found")
        }

        // get all tweets of user
        const tweets = await Tweet.aggregate([
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                // get owner details
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "ownerDetails",
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
                // get likes on each tweet
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "tweet",
                    as: "tweetLikes"
                }
            },
            {
                $addFields: {
                    ownerDetails: {
                        $first: "$ownerDetails"
                    },
                    likesCount: {
                        $size: "$tweetLikes"
                    },
                    // check if logged in user liked the tweet
                    isLiked: {
                        $cond: {
                            if: {
                                $in: [
                                    new mongoose.Types.ObjectId(req.user?._id),
                                    "$tweetLikes.likedBy"
                                ]
                            },
                            then: true,
                            else: false
                        }
                    }
                }
            },
            {
                // remove tweetLikes array from response
                $project: {
                    content: 1,
                    ownerDetails: 1,
                    likesCount: 1,
                    isLiked: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            },
            {
                // latest tweets first
                $sort: {
                    createdAt: -1
                }
            }
        ])

        // if no tweets found
        if (!tweets || tweets.length === 0) {
            return res.status(200)
                .json(new ApiResponse(200, [], "No tweets found for this user"))
        }

        return res.status(200)
            .json(new ApiResponse(200, tweets, "User tweets fetched successfully"))

    } catch (error) {
        if (error instanceof ApiError) {
            throw error
        }
        throw new ApiError(500, error?.message || "Internal server error")
    }
})

const updateTweet = asyncHandler(async (req, res) => {
    try {
        const { tweetId } = req.params
        const { content } = req.body

        // validate tweetId
        if (!tweetId || !isValidObjectId(tweetId)) {
            throw new ApiError(400, "Invalid tweet id")
        }

        // validate content
        if (!content || content.trim() === "") {
            throw new ApiError(400, "Tweet content is required")
        }

        // check content length
        if (content.length > 280) {
            throw new ApiError(400, "Tweet content must be less than 280 characters")
        }

        // check if tweet exists
        const tweet = await Tweet.findById(tweetId)

        if (!tweet) {
            throw new ApiError(404, "Tweet not found")
        }

        // check if logged in user is the owner of tweet
        if (tweet.owner.toString() !== req.user?._id.toString()) {
            throw new ApiError(403, "You are not authorized to update this tweet")
        }

        // update tweet
        const updatedTweet = await Tweet.findByIdAndUpdate(
            tweetId,
            {
                $set: {
                    content: content.trim()
                }
            },
            {
                new: true  // returns updated document
            }
        )

        if (!updatedTweet) {
            throw new ApiError(500, "Something went wrong while updating tweet")
        }

        return res.status(200)
            .json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"))

    } catch (error) {
        if (error instanceof ApiError) {
            throw error
        }
        throw new ApiError(500, error?.message || "Internal server error")
    }
})

const deleteTweet = asyncHandler(async (req, res) => {
    try {
        const { tweetId } = req.params

        // validate tweetId
        if (!tweetId || !isValidObjectId(tweetId)) {
            throw new ApiError(400, "Invalid tweet id")
        }

        // check if tweet exists
        const tweet = await Tweet.findById(tweetId)

        if (!tweet) {
            throw new ApiError(404, "Tweet not found")
        }

        // check if logged in user is the owner of tweet
        if (tweet.owner.toString() !== req.user?._id.toString()) {
            throw new ApiError(403, "You are not authorized to delete this tweet")
        }

        // delete tweet
        const deletedTweet = await Tweet.findByIdAndDelete(tweetId)

        if (!deletedTweet) {
            throw new ApiError(500, "Something went wrong while deleting tweet")
        }

        // also delete all likes of this tweet
        await Like.deleteMany({
            tweet: tweetId
        })

        return res.status(200)
            .json(new ApiResponse(200, deletedTweet, "Tweet deleted successfully"))

    } catch (error) {
        if (error instanceof ApiError) {
            throw error
        }
        throw new ApiError(500, error?.message || "Internal server error")
    }
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}