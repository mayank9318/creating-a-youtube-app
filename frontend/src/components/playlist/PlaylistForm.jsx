import { useState } from "react";

function PlaylistForm({ initialValues = {}, onSubmit, loading = false, submitLabel = "Save playlist" }) {
    const [name, setName] = useState(initialValues.name || "");
    const [description, setDescription] = useState(initialValues.description || "");

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSubmit?.({ name: name.trim(), description: description.trim() });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Playlist name" required />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                rows={3}
            />
            <button type="submit" disabled={loading}>
                {loading ? "Saving..." : submitLabel}
            </button>
        </form>
    );
}

export default PlaylistForm;

