import mongoose, {Schema} from 'mongoose';
import mongooseAggPaginate from 'mongoose-aggregate-paginate-v2';



const videoSchema= new Schema(
    {
video:{
    type:String,// cloudinary url
    required:[true, "video file is reuired"]
},
thumbnail:{
    type:String,// cloudinary url
    required:[true, "thumbnail is reuired"]
},
title:{
    type:String,
    required:[true, "title is reuired"]
},
description:{
    type:String,
    required:[true, "description is reuired"]
},
duration:{
    type:Number,
    required:[true, "duration is reuired"]
},
views:{
    type:Number,
    default:0,
},
isPublished:{
    type:Boolean,
    default:true,
},
owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
}
    },
    {
        timestamps:true,
    }
)
export const Video= mongoose.model("Video", videoSchema)