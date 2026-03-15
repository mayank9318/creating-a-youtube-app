import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
} from "../controllers/video.controllers.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"


const router = Router();

router.route("/").get(getAllVideos);

router
    .route("/")
    .post(
        verifyJWT,
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
        ]),
        publishAVideo
    );

// IMPORTANT: This must come BEFORE /:videoId to avoid Express matching "toggle" as a videoId
router.route("/toggle/publish/:videoId").patch(verifyJWT, togglePublishStatus);

router
    .route("/:videoId")
    .get(getVideoById)
    .delete(verifyJWT, deleteVideo)
    .patch(verifyJWT, upload.single("thumbnail"), updateVideo);

export default router