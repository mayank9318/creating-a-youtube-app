import { useMemo, useState, useEffect } from "react";
import { Link, Route, Routes, useParams, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Sidebar from "./components/common/Sidebar";
import Footer from "./components/common/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";
import VideoGrid from "./components/video/VideoGrid";
import VideoPlayer from "./components/video/VideoPlayer";
import VideoUploadForm from "./components/video/VideoUploadForm";
import CommentForm from "./components/comment/CommentForm";
import CommentList from "./components/comment/CommentList";
import LikeButton from "./components/like/LikeButton";
import PlaylistCard from "./components/playlist/PlaylistCard";
import PlaylistVideoItem from "./components/playlist/PlaylistVideoItem";
import TweetForm from "./components/tweet/TweetForm";
import TweetList from "./components/tweet/TweetList";
import SubscribeButton from "./components/subscription/SubscribeButton";
import StatsCard from "./components/dashboard/StatsCard";
import DashboardVideoTable from "./components/dashboard/DashboardVideoTable";
import { useAuthContext } from "./context/AuthContext";
import { getAllVideos, getVideoById, publishVideo } from "./api/videoApi";
import { getChannelStats, getChannelVideos } from "./api/dashboardApi";
import { formatViews } from "./utils/helpers";
import "./App.css";

const sampleVideos = [
    {
        _id: "v1",
        title: "React Hook Patterns",
        thumbnail: "https://via.placeholder.com/420x236?text=Video+1",
        views: 13240,
        createdAt: "2026-02-20T10:00:00.000Z",
        isPublished: true,
        owner: { username: "devalpha" },
    },
    {
        _id: "v2",
        title: "Node API Architecture",
        thumbnail: "https://via.placeholder.com/420x236?text=Video+2",
        views: 890,
        createdAt: "2026-02-21T10:00:00.000Z",
        isPublished: false,
        owner: { username: "devbeta" },
    },
];

const sampleComments = [
    {
        _id: "c1",
        content: "Clean implementation.",
        createdAt: "2026-02-22T10:00:00.000Z",
        owner: { username: "alice" },
    },
];

const sampleTweets = [
    {
        _id: "t1",
        content: "New video is live now.",
        createdAt: "2026-02-21T12:00:00.000Z",
        likesCount: 3,
        isLiked: false,
        owner: { username: "creator" },
    },
];

const samplePlaylist = {
    _id: "p1",
    name: "Frontend Essentials",
    description: "Reusable UI and state-management examples.",
    videos: sampleVideos,
};

function HomePage() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true);
                const res = await getAllVideos();
                setVideos(res.data.data.videos || []);
            } catch (err) {
                setError("Failed to load videos");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchVideos();
    }, []);

    if (loading) return <div className="page-section"><p>Loading videos...</p></div>;
    if (error) return <div className="page-section"><p className="form-error">{error}</p></div>;

    return (
        <section className="page-section">
            <h2>Home</h2>
            {videos.length > 0 ? (
                <VideoGrid videos={videos} />
            ) : (
                <p>No videos found.</p>
            )}
        </section>
    );
}

function VideoDetailPage() {
    const { videoId } = useParams();
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                setLoading(true);
                const res = await getVideoById(videoId);
                setVideo(res.data.data);
            } catch (err) {
                setError("Failed to load video");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchVideo();
    }, [videoId]);

    if (loading) return <div className="page-section"><p>Loading video...</p></div>;
    if (error) return <div className="page-section"><p className="form-error">{error}</p></div>;
    if (!video) return <div className="page-section"><p>Video not found.</p></div>;

    return (
        <section className="page-section">
            <h2>{video.title}</h2>
            <VideoPlayer
                src={video.videoFile}
                poster={video.thumbnail}
                title={video.title}
            />
            <div className="video-info">
                <p>{video.views} views • {new Date(video.createdAt).toLocaleDateString()}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <LikeButton isLiked={video.isLiked} likesCount={video.likesCount} onToggle={() => {}} />
                    {video.owner && (
                         <div style={{ marginLeft: "auto" }}>
                            <Link to={`/channel/${video.owner.username}`}>
                                <strong>{video.owner.fullName}</strong>
                            </Link>
                         </div>
                    )}
                </div>
                <hr style={{ borderColor: "var(--border)", margin: "1rem 0" }} />
                <p>{video.description}</p>
            </div>
            
            <CommentForm videoId={videoId} onSubmit={async () => {}} />
            {/* CommentList should fetch real comments too, but for now we keep it simple */}
            <CommentList videoId={videoId} />
        </section>
    );
}

function VideoUploadPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleUpload = async (formData) => {
        try {
            setLoading(true);
            setError("");
            await publishVideo(formData);
            navigate("/");
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to upload video");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="page-section">
            <h2>Upload Video</h2>
            <VideoUploadForm onSubmit={handleUpload} loading={loading} />
            {error && <p className="form-error" style={{ marginTop: "1rem" }}>{error}</p>}
        </section>
    );
}

function ChannelPage() {
    const [subscribed, setSubscribed] = useState(false);
    const [count, setCount] = useState(128);

    const onToggle = () => {
        setSubscribed((prev) => !prev);
        setCount((prev) => (subscribed ? prev - 1 : prev + 1));
    };

    return (
        <section className="page-section">
            <h2>Channel</h2>
            <SubscribeButton
                isSubscribed={subscribed}
                subscribersCount={count}
                onToggle={onToggle}
            />
        </section>
    );
}

function WatchHistoryPage() {
    return (
        <section className="page-section">
            <h2>Watch History</h2>
            <VideoGrid videos={sampleVideos} />
        </section>
    );
}

function PlaylistPage() {
    return (
        <section className="page-section">
            <h2>Playlist</h2>
            <PlaylistCard playlist={samplePlaylist} />
            {sampleVideos.map((video) => (
                <PlaylistVideoItem key={video._id} video={video} />
            ))}
        </section>
    );
}

function UserPlaylistsPage() {
    return (
        <section className="page-section">
            <h2>User Playlists</h2>
            <PlaylistCard playlist={samplePlaylist} />
        </section>
    );
}

function TweetsPage() {
    return (
        <section className="page-section">
            <h2>Tweets</h2>
            <TweetForm onSubmit={async () => {}} />
            <TweetList tweets={sampleTweets} />
        </section>
    );
}

function LikedVideosPage() {
    return (
        <section className="page-section">
            <h2>Liked Videos</h2>
            <VideoGrid videos={sampleVideos} />
        </section>
    );
}

function SettingsPage() {
    return (
        <section className="page-section">
            <h2>Settings</h2>
            <p>Update account details, avatar, cover image, and password.</p>
        </section>
    );
}

function DashboardPage() {
    const [statsData, setStatsData] = useState({ totalViews: 0, totalSubscribers: 0, totalVideos: 0, totalLikes: 0 });
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [statsRes, videosRes] = await Promise.all([
                    getChannelStats(),
                    getChannelVideos()
                ]);
                
                setStatsData(statsRes.data.data);
                setVideos(videosRes.data.data || []);
            } catch (err) {
                setError("Failed to load dashboard data");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const stats = useMemo(
        () => [
            { label: "Total Views", value: formatViews(statsData.totalViews) },
            { label: "Subscribers", value: statsData.totalSubscribers.toString() },
            { label: "Videos", value: statsData.totalVideos.toString() },
            { label: "Likes", value: statsData.totalLikes.toString() },
        ],
        [statsData]
    );

    if (loading) return <div className="page-section"><p>Loading dashboard...</p></div>;
    if (error) return <div className="page-section"><p className="form-error">{error}</p></div>;

    return (
        <section className="page-section">
            <h2>Dashboard</h2>
            <div className="dashboard-stats">
                {stats.map((item) => (
                    <StatsCard key={item.label} label={item.label} value={item.value} />
                ))}
            </div>
            <DashboardVideoTable videos={videos} />
        </section>
    );
}

function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuthContext();
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const payload = identifier.includes("@")
                ? { email: identifier.trim(), password }
                : { username: identifier.trim(), password };
            await login(payload);
            navigate("/", { replace: true });
        } catch (err) {
            setError(err?.response?.data?.message || "Login failed. Check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="page-section auth-page">
            <h2>Login</h2>
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Email or username"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <div style={{ position: "relative", width: "100%" }}>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ paddingRight: "40px", width: "100%" }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            style={{
                                position: "absolute",
                                right: "8px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: 0,
                                fontSize: "16px"
                            }}
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                    </div>
                </div>

                {error ? <p className="form-error">{error}</p> : null}
                <button type="submit" disabled={loading} style={{ marginTop: "20px" }}>
                    {loading ? "Signing in..." : "Login"}
                </button>
                <p className="auth-switch">
                    New here? <Link to="/register">Create account</Link>
                </p>
            </form>
        </section>
    );
}

function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuthContext();
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [validationErrors, setValidationErrors] = useState({});

    // Validation function
    const validateForm = () => {
        const errors = {};
        
        if (!fullName.trim()) errors.fullName = "Full name is required";
        if (!username.trim()) errors.username = "Username is required";
        if (username.trim().length < 3) errors.username = "Username must be at least 3 characters";
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) errors.email = "Email is required";
        if (!emailRegex.test(email)) errors.email = "Invalid email format";
        
        if (!password) errors.password = "Password is required";
        if (password.length < 6) errors.password = "Password must be at least 6 characters";
        if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match";
        
        if (!avatar) errors.avatar = "Avatar is required";
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle avatar file selection with preview
    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            if (!file.type.startsWith("image/")) {
                setValidationErrors((prev) => ({ ...prev, avatar: "Avatar must be an image file" }));
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setValidationErrors((prev) => ({ ...prev, avatar: "Avatar must be less than 5MB" }));
                return;
            }
            setAvatar(file);
            const reader = new FileReader();
            reader.onload = (e) => setAvatarPreview(e.target.result);
            reader.readAsDataURL(file);
            setValidationErrors((prev) => {
                const updated = { ...prev };
                delete updated.avatar;
                return updated;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("fullName", fullName.trim());
            formData.append("username", username.trim().toLowerCase());
            formData.append("email", email.trim());
            formData.append("password", password);
            if (avatar) formData.append("avatar", avatar);
            if (coverImage) formData.append("coverImage", coverImage);

            await register(formData);
            navigate("/login", { replace: true });
        } catch (err) {
            setError(err?.response?.data?.message || "Registration failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="page-section auth-page">
            <h2>Register</h2>
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                    {validationErrors.fullName && <p className="form-error-small">{validationErrors.fullName}</p>}
                </div>

                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    {validationErrors.username && <p className="form-error-small">{validationErrors.username}</p>}
                </div>

                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {validationErrors.email && <p className="form-error-small">{validationErrors.email}</p>}
                </div>

                <div className="form-group">
                    <div style={{ position: "relative", width: "100%" }}>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ paddingRight: "40px", width: "100%" }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            style={{
                                position: "absolute",
                                right: "8px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: 0,
                                fontSize: "16px"
                            }}
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                    </div>
                    {validationErrors.password && <p className="form-error-small">{validationErrors.password}</p>}
                </div>

                <div className="form-group">
                    <div style={{ position: "relative", width: "100%" }}>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            style={{ paddingRight: "40px", width: "100%" }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            style={{
                                position: "absolute",
                                right: "8px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: 0,
                                fontSize: "16px"
                            }}
                        >
                            {showConfirmPassword ? "🙈" : "👁️"}
                        </button>
                    </div>
                    {validationErrors.confirmPassword && <p className="form-error-small">{validationErrors.confirmPassword}</p>}
                </div>

                <div className="form-group file-upload">
                    <label className="file-label">
                        <span>Avatar (Required)</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            required
                        />
                    </label>
                    {avatarPreview && (
                        <div style={{ marginTop: "10px" }}>
                            <img 
                                src={avatarPreview} 
                                alt="Avatar preview" 
                                style={{ maxWidth: "100px", maxHeight: "100px", borderRadius: "4px" }}
                            />
                        </div>
                    )}
                    {validationErrors.avatar && <p className="form-error-small">{validationErrors.avatar}</p>}
                    {avatar && <p style={{ fontSize: "12px", color: "#666" }}>✓ {avatar.name}</p>}
                </div>

                <div className="form-group file-upload">
                    <label className="file-label">
                        <span>Cover Image (Optional)</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                        />
                    </label>
                    {coverImage && <p style={{ fontSize: "12px", color: "#666" }}>✓ {coverImage.name}</p>}
                </div>

                {error ? <p className="form-error">{error}</p> : null}
                <button type="submit" disabled={loading} style={{ marginTop: "20px" }}>
                    {loading ? "Creating account..." : "Register"}
                </button>
                <p className="auth-switch">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </form>
        </section>
    );
}

function NotFoundPage() {
    return (
        <section className="page-section">
            <h2>404</h2>
            <p>Page not found.</p>
            <Link to="/">Go Home</Link>
        </section>
    );
}

function App() {
    const location = useLocation();
    const { user, logout } = useAuthContext();
    const [searchValue, setSearchValue] = useState("");
    const isAuthRoute = location.pathname === "/login" || location.pathname === "/register";

    const sidebarItems = [
        { to: "/", label: "Home" },
        { to: "/upload", label: "Video Upload" },
        { to: "/history", label: "Watch History" },
        { to: "/likes/videos", label: "Liked Videos" },
        { to: "/dashboard", label: "Dashboard" },
        { to: "/settings", label: "Settings" },
    ];

    return (
        <div className="app-shell">
            <Navbar
                brand="Video Platform"
                user={user}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                onLogout={logout}
            />
            <div className={`layout ${isAuthRoute ? "layout-auth" : ""}`}>
                {!isAuthRoute ? <Sidebar items={sidebarItems} /> : null}
                <main className={`app-main ${isAuthRoute ? "app-main-auth" : ""}`}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/videos/:videoId" element={<VideoDetailPage />} />
                        <Route path="/channel/:username" element={<ChannelPage />} />
                        <Route path="/playlist/:playlistId" element={<PlaylistPage />} />
                        <Route path="/playlist/user/:userId" element={<UserPlaylistsPage />} />
                        <Route path="/tweets/user/:userId" element={<TweetsPage />} />
                        <Route path="/likes/videos" element={<LikedVideosPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />

                        <Route
                            path="/upload"
                            element={
                                <ProtectedRoute>
                                    <VideoUploadPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/history"
                            element={
                                <ProtectedRoute>
                                    <WatchHistoryPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/settings"
                            element={
                                <ProtectedRoute>
                                    <SettingsPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <DashboardPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </main>
            </div>
            <Footer text="© 2026 Video Platform" />
        </div>
    );
}

export default App;
