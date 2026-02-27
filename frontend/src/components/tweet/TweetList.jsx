import TweetCard from "./TweetCard";

function TweetList({ tweets = [], canEditTweet, onUpdateTweet, onDeleteTweet, onToggleLike }) {
    if (!tweets.length) return <p>No tweets yet.</p>;

    return (
        <section>
            {tweets.map((tweet) => (
                <TweetCard
                    key={tweet._id}
                    tweet={tweet}
                    canEdit={canEditTweet?.(tweet)}
                    onUpdate={onUpdateTweet}
                    onDelete={onDeleteTweet}
                    onLikeToggle={onToggleLike}
                />
            ))}
        </section>
    );
}

export default TweetList;
