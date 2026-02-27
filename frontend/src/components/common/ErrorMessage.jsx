function ErrorMessage({ message = "Something went wrong." }) {
    return (
        <p role="alert" style={{ color: "crimson" }}>
            {message}
        </p>
    );
}

export default ErrorMessage;
