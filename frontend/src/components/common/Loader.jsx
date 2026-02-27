function Loader({ text = "Loading..." }) {
    return (
        <div role="status" aria-live="polite">
            {text}
        </div>
    );
}

export default Loader;
