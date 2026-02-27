function VideoPlayer({ src, poster, title = "Video player" }) {
    if (!src) return <p>Video source not available.</p>;

    return (
        <video controls poster={poster} title={title} width="100%">
            <source src={src} />
            Your browser does not support video playback.
        </video>
    );
}

export default VideoPlayer;

