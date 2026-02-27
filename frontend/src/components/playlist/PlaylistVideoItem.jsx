import { Link } from "react-router-dom";

function PlaylistVideoItem({ video, onRemove, removing = false }) {
    if (!video) return null;

    return (
        <div>
            <Link to={`/videos/${video._id}`}>{video.title}</Link>
            {onRemove ? (
                <button type="button" onClick={() => onRemove(video._id)} disabled={removing}>
                    {removing ? "Removing..." : "Remove"}
                </button>
            ) : null}
        </div>
    );
}

export default PlaylistVideoItem;

