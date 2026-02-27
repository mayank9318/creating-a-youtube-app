import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination

    const pageNUmber = parseInt(page);
    const limitNumber = parseInt(limit);

    if (pageNUmber < 1) {
        throw new ApiError(300, "page number must be greater than 0");
    
        
    }
    if(limitNumber < 1 || limitNumber > 100){
        throw new ApiError(400, "limit must be between 1 and 100")
    }

    //build the filter object
    const filter = { isPublished: true}; // only fetch published videos
    if (userId) {
          if(!isValidObjectId(userId)){
            throw new ApiError(400, "invalid user id")           
    }
    filter.owner = userId;
}

if(query){
  filter.$or =[
    {
        title:{$regex:query, $options:"i"}
    },
    {
        description:{$regex:query,$options:"i"}
    }

  ];

}

//build the sort object
 const sort ={};
 if (sortBy){
    const allowSortFields = ["createdAt", "title", "views","duration"];
    if(!allowSortFields.includes(sortBy)){
        throw new ApiError(400, `sort field must be one of: ${allowSortFields.join(",")}`);
    }
    
    const sortDirection = sortType === 'asc'? 1:-1;
    sort[sortBy] = sortDirection;
 }else{
    // default sort by createdAt desc
    sort.createdAt = -1; 
 }

 //calculate skip for pagination
 const sKip = (pageNUmber - 1)* limitNumber;

 //execute the query with aggregation pipeline
    const videos = await Video.aggregate([
        {$match: filter},
        {
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"ownerDetails",
                pipeline:[
                    {
                        $project:{
                            username:1,
                            fullName:1,
                            avatar:1
                        }
                    }
                ]
            }
        },
        {
            $unwind:{
                path:"$ownerDetails",
                preserveNullAndEmptyArrays:false
            }
        },
           {
            $sort: sort
       },
           {$skip: sKip
        },
           {
            $limit:limitNumber
        },
        {
            $project:{
                title:1,
                description:1,
                thumbnail:1,
                duration:1,
                views:1,
                createdAt:1,
                isPublished:1,
                videoFile:1,
                owner:{
                    _id:"$ownerDetails._id",
                    username:"$ownerDetails.username",
                    fullName:"$ownerDetails.fullName",
                    avatar:"$ownerDetails.avatar"
                }
                
            }
        }
    ]);

    const totalVideos = await Video.countDocuments(filter);
    // calculate total pag
    const totalPages = Math.ceil(totalVideos/ limitNumber);
    const hasNextpage = pageNUmber < totalPages;
    const hasPrevpage = pageNUmber > 1;


    return res.status(200).json(
        new ApiResponse(
            200,{
                videos,
                pagination:{
               currentPage:pageNUmber,
                totalPages,
                totalVideos,
                limit:limitNumber,
                hasNextpage,
                hasPrevpage
                    
            }
          },
            "videos fetched successfully"
        )
    )
 
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description, duration: durationFromBody } = req.body;

    // Validate required body fields
    if (!title?.trim()) {
        throw new ApiError(400, "Title is required");
    }
    if (!description?.trim()) {
        throw new ApiError(400, "Description is required");
    }

    // Validate that both files were uploaded
    const videoFile = req.files?.videoFile?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];

    if (!videoFile?.path) {
        throw new ApiError(400, "Video file is required");
    }
    if (!thumbnailFile?.path) {
        throw new ApiError(400, "Thumbnail is required");
    }

    // Upload video to Cloudinary
    const videoUploadResponse = await uploadOnCloudinary(videoFile.path);
    if (!videoUploadResponse?.url) {
        throw new ApiError(500, "Failed to upload video to Cloudinary");
    }

    // Upload thumbnail to Cloudinary
    const thumbnailUploadResponse = await uploadOnCloudinary(thumbnailFile.path);
    if (!thumbnailUploadResponse?.url) {
        throw new ApiError(500, "Failed to upload thumbnail to Cloudinary");
    }

    // Duration: prefer Cloudinary (for video), then request body, then reject
    const duration =
        videoUploadResponse.duration != null
            ? Math.round(Number(videoUploadResponse.duration))
            : (durationFromBody != null ? Number(durationFromBody) : undefined);

    if (duration == null || Number.isNaN(duration) || duration <= 0) {
        throw new ApiError(400, "Valid duration is required (from video or request body)");
    }

    // Create video document (owner set by verifyJWT)
    const ownerId = req.user?._id;
    if (!ownerId) {
        throw new ApiError(401, "Unauthorized");
    }

    const video = await Video.create({
        title: title.trim(),
        description: description.trim(),
        videoFile: videoUploadResponse.secure_url || videoUploadResponse.url,
        thumbnail: thumbnailUploadResponse.secure_url || thumbnailUploadResponse.url,
        duration,
        owner: ownerId,
    });

    return res.status(201).json(
        new ApiResponse(201, video, "Video published successfully")
    );
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id");
        
    }
    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(404,"video not found")
    }
    video.views += 1;
    await video.save();

    return res.status(200)
    .json(new ApiResponse(200,"video fetch successfully "))
    
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description } = req.body

    // Validate videoId
    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid or missing video ID")
    }

    // Validate fields
    if (!title && !description && !req.file) {
        throw new ApiError(400, "At least one field (title, description, thumbnail) is required")
    }

    // Find video
    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    // Check if the logged-in user is the owner
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this video")
    }

    // Handle thumbnail upload if provided
    let thumbnailUrl = video.thumbnail // keep old thumbnail by default

    if (req.file) {
        // Delete old thumbnail from cloudinary
        if (video.thumbnail) {
            const oldThumbnailPublicId = video.thumbnail
                .split("/")
                .pop()
                .split(".")[0]
            await deleteFromCloudinary(oldThumbnailPublicId)
        }

        // Upload new thumbnail
        const uploadedThumbnail = await uploadOnCloudinary(req.file.path)

        if (!uploadedThumbnail) {
            throw new ApiError(500, "Failed to upload thumbnail")
        }

        thumbnailUrl = uploadedThumbnail.url
    }

    // Update video
    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title: title || video.title,
                description: description || video.description,
                thumbnail: thumbnailUrl
            }
        },
        { new: true }
    )

    if (!updatedVideo) {
        throw new ApiError(500, "Failed to update video")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedVideo, "Video updated successfully"))
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    // Validate videoId
    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid or missing video ID")
    }

    // Find video
    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    // Check if the logged-in user is the owner
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this video")
    }

    // Delete video file from cloudinary
    if (video.videoFile) {
        const videoPublicId = video.videoFile
            .split("/")
            .pop()
            .split(".")[0]
        await deleteFromCloudinary(videoPublicId)
    }

    // Delete thumbnail from cloudinary
    if (video.thumbnail) {
        const thumbnailPublicId = video.thumbnail
            .split("/")
            .pop()
            .split(".")[0]
        await deleteFromCloudinary(thumbnailPublicId)
    }

    // Delete video from database
    const deletedVideo = await Video.findByIdAndDelete(videoId)

    if (!deletedVideo) {
        throw new ApiError(500, "Failed to delete video")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Video deleted successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    // Validate videoId
    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid or missing video ID")
    }

    // Find video
    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    // Check if the logged-in user is the owner
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to toggle publish status")
    }

    // Toggle publish status
    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                isPublished: !video.isPublished
            }
        },
        { new: true }
    )

    if (!updatedVideo) {
        throw new ApiError(500, "Failed to toggle publish status")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedVideo,
                `Video is now ${updatedVideo.isPublished ? "published" : "unpublished"}`
            )
        )
})
export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}