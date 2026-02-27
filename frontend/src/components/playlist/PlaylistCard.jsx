import { Link } from "react-router-dom";

function PlaylistCard({ playlist }) {
    if (!playlist) return null;

    const count = playlist.videos?.length || 0;

    return (
        <article>
            <h4>{playlist.name}</h4>
            <p>{playlist.description}</p>
            <p>{count} videos</p>
            <Link to={`/playlist/${playlist._id}`}>Open playlist</Link>
        </article>
    );
}

export default PlaylistCard;

