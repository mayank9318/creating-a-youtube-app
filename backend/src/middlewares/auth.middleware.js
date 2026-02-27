import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";


 
 export const verifyJWT = asyncHandler(async(req,res,next)=>{
try {
    const Token = req.cookies?.accessToken || req.headers?.authorization?.replace("Bearer ","")
    if (!Token) {
        throw new ApiError(401,"unauthorized request")
    }
    const decodedToken = jwt.verify(Token,process.env.ACCESS_TOKEN_SECRET )
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    if (!user) {
        throw new ApiError(401,"invalid access Token ")
    }
    req.user = user;
    next()
} catch (error) {
    next(new ApiError(401,error?.message || "invalid access token "))
}


 })




