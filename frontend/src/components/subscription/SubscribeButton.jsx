function SubscribeButton({ isSubscribed = false, subscribersCount = 0, onToggle, loading = false }) {
    return (
        <button type="button" onClick={onToggle} disabled={loading}>
            {loading
                ? "Please wait..."
                : `${isSubscribed ? "Subscribed" : "Subscribe"} (${subscribersCount})`}
        </button>
    );
}

export default SubscribeButton;
