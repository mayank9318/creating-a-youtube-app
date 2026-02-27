import { Link } from "react-router-dom";

function DashboardVideoTable({ videos = [], onTogglePublish, onDelete }) {
    if (!videos.length) return <p>No channel videos found.</p>;

    return (
        <table>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Views</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {videos.map((video) => (
                    <tr key={video._id}>
                        <td>
                            <Link to={`/videos/${video._id}`}>{video.title}</Link>
                        </td>
                        <td>{video.views || 0}</td>
                        <td>{video.isPublished ? "Published" : "Draft"}</td>
                        <td>
                            <button type="button" onClick={() => onTogglePublish?.(video._id)}>
                                {video.isPublished ? "Unpublish" : "Publish"}
                            </button>
                            <button type="button" onClick={() => onDelete?.(video._id)}>
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default DashboardVideoTable;
