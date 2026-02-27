import { useState } from "react";
import { timeAgo } from "../../utils/helpers";
import CommentForm from "./CommentForm";

function CommentItem({ comment, canEdit = false, onUpdate, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);

    if (!comment) return null;

    const handleUpdate = async (content) => {
        await onUpdate?.(comment._id, content);
        setIsEditing(false);
    };

    return (
        <article className="comment-item">
            <p className="card-meta">
                <strong>{comment.owner?.username || "User"}</strong> • {timeAgo(comment.createdAt)}
            </p>
            {isEditing ? (
                <CommentForm
                    initialValue={comment.content}
                    submitLabel="Update"
                    onSubmit={handleUpdate}
                    onCancel={() => setIsEditing(false)}
                />
            ) : (
                <p>{comment.content}</p>
            )}
            {canEdit && !isEditing ? (
                <div className="action-row">
                    <button type="button" onClick={() => setIsEditing(true)}>
                        Edit
                    </button>
                    <button type="button" onClick={() => onDelete?.(comment._id)}>
                        Delete
                    </button>
                </div>
            ) : null}
        </article>
    );
}

export default CommentItem;