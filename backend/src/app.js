
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'


const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"20kb"}))
app.use(express.urlencoded({extended:true, limit: "20kb" }))
app.use(express.static("public"))
app.use(cookieParser())


import userRouter from "./routs/user.routes.js"
import commentRouter from "./routs/comment.routes.js"
import subscriptionRouter from "./routs/subscription.routes .js"
import playlistRouter from "./routs/playlist.routes.js"
import tweetRouter from "./routs/tweet.routes.js"
import videoRouter from "./routs/video.routes.js"
import likeRouter from "./routs/like.routes.js"
import dashboardRouter from "./routs/dashboard.routes.js"

//router declaration 
app.use('/api/v1/user', userRouter)
app.use('/api/v1/comment', commentRouter)
app.use('/api/v1/subscription', subscriptionRouter)
app.use('/api/v1/playlist', playlistRouter)
app.use('/api/v1/tweet', tweetRouter)
app.use('/api/v1/video', videoRouter)
app.use('/api/v1/like', likeRouter)
app.use('/api/v1/dashboard', dashboardRouter)
//http://localhost:8800/api/v1/user/register
export default app