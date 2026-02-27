import { useEffect, useState } from "react";

function TweetForm({ initialValue = "", onSubmit, loading = false, submitLabel = "Tweet" }) {
    const [content, setContent] = useState(initialValue);

    useEffect(() => {
        setContent(initialValue);
    }, [initialValue]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        await onSubmit?.(content.trim());
        if (!initialValue) setContent("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's happening?"
                rows={3}
            />
            <button type="submit" disabled={loading}>
                {loading ? "Posting..." : submitLabel}
            </button>
        </form>
    );
}

export default TweetForm;

