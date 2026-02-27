import { useState } from "react";

function VideoEditForm({ initialValues = {}, onSubmit, loading = false }) {
    const [title, setTitle] = useState(initialValues.title || "");
    const [description, setDescription] = useState(initialValues.description || "");
    const [thumbnail, setThumbnail] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        if (thumbnail) formData.append("thumbnail", thumbnail);
        await onSubmit?.(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                rows={4}
            />
            <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} />
            <button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save changes"}
            </button>
        </form>
    );
}

export default VideoEditForm;
