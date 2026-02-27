import { useState } from "react";
import { timeAgo } from "../../utils/helpers";
import LikeButton from "../like/LikeButton";
import TweetForm from "./TweetForm";

function TweetCard({ tweet, canEdit = false, onUpdate, onDelete, onLikeToggle }) {
    const [isEditing, setIsEditing] = useState(false);

    if (!tweet) return null;

    const handleUpdate = async (content) => {
        await onUpdate?.(tweet._id, content);
        setIsEditing(false);
    };

    return (
        <article className="tweet-card">
            <p className="card-meta">
                <strong>{tweet.owner?.username || "User"}</strong> • {timeAgo(tweet.createdAt)}
            </p>
            {isEditing ? (
                <TweetForm initialValue={tweet.content} submitLabel="Update" onSubmit={handleUpdate} />
            ) : (
                <p>{tweet.content}</p>
            )}
            <LikeButton
                isLiked={Boolean(tweet.isLiked)}
                likesCount={tweet.likesCount || 0}
                onToggle={() => onLikeToggle?.(tweet._id)}
            />
            {canEdit && !isEditing ? (
                <div className="action-row">
                    <button type="button" onClick={() => setIsEditing(true)}>
                        Edit
                    </button>
                    <button type="button" onClick={() => onDelete?.(tweet._id)}>
                        Delete
                    </button>
                </div>
            ) : null}
        </article>
    );
}

export default TweetCard;