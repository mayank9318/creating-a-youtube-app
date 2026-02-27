import { Link } from "react-router-dom";
import { formatViews, timeAgo } from "../../utils/helpers";

function VideoCard({ video }) {
    if (!video) return null;

    return (
        <article className="video-card">
            <Link to={`/videos/${video._id}`}>
                <img src={video.thumbnail} alt={video.title} />
            </Link>
            <div className="video-meta">
                <h4>{video.title}</h4>
                <p>{video.owner?.username || "Unknown channel"}</p>
                <p>
                    {formatViews(video.views)} views • {timeAgo(video.createdAt)}
                </p>
            </div>
        </article>
    );
}

export default VideoCard;