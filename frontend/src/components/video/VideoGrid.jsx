import VideoCard from "./VideoCard";

function VideoGrid({ videos = [] }) {
    if (!videos.length) return <p>No videos found.</p>;

    return (
        <section className="video-grid">
            {videos.map((video) => (
                <VideoCard key={video._id} video={video} />
            ))}
        </section>
    );
}

export default VideoGrid;

