import { Router } from 'express';
import { getChannelStats, getChannelVideos } from "../controllers/dashboard.controllers.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT);

// Placeholder routes - TODO: implement controllers
router.route("/stats").get((req, res) => {
    res.status(200).json({
        statusCode: 200,
        data: {
            totalViews: 0,
            totalSubscribers: 0,
            totalVideos: 0,
            totalLikes: 0
        },
        message: "Channel stats fetched successfully",
        success: true
    });
});

router.route("/videos").get((req, res) => {
    res.status(200).json({
        statusCode: 200,
        data: [],
        message: "Channel videos fetched successfully",
        success: true
    });
});

export default router
