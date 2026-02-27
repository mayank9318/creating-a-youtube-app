import CommentItem from "./CommentItem";

function CommentList({ comments = [], canEditComment, onUpdateComment, onDeleteComment }) {
    if (!comments.length) return <p>No comments yet.</p>;

    return (
        <section>
            {comments.map((comment) => (
                <CommentItem
                    key={comment._id}
                    comment={comment}
                    canEdit={canEditComment?.(comment)}
                    onUpdate={onUpdateComment}
                    onDelete={onDeleteComment}
                />
            ))}
        </section>
    );
}

export default CommentList;
