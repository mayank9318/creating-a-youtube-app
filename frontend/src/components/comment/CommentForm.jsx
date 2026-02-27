import { useEffect, useState } from "react";

function CommentForm({
    initialValue = "",
    submitLabel = "Post",
    onSubmit,
    loading = false,
    onCancel,
}) {
    const [content, setContent] = useState(initialValue);

    useEffect(() => {
        setContent(initialValue);
    }, [initialValue]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        await onSubmit?.(content.trim());
        setContent("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={3} placeholder="Write a comment..." />
            <button type="submit" disabled={loading}>
                {loading ? "Please wait..." : submitLabel}
            </button>
            {onCancel ? (
                <button type="button" onClick={onCancel}>
                    Cancel
                </button>
            ) : null}
        </form>
    );
}

export default CommentForm;

