function LikeButton({
    isLiked = false,
    likesCount = 0,
    disabled = false,
    onToggle,
    size = "md",
}) {
    const label = isLiked ? "Unlike" : "Like";

    return (
        <button
            type="button"
            onClick={onToggle}
            disabled={disabled}
            aria-pressed={isLiked}
            className={`like-btn like-btn-${size}`}
        >
            {label} ({likesCount})
        </button>
    );
}

export default LikeButton;

