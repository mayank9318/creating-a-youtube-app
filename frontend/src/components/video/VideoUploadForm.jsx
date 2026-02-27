import { useState } from "react";

function VideoUploadForm({ onSubmit, loading = false }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        if (videoFile) formData.append("videoFile", videoFile);
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
            <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} required />
            <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} required />
            <button type="submit" disabled={loading}>
                {loading ? "Uploading..." : "Upload video"}
            </button>
        </form>
    );
}

export default VideoUploadForm;

