import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { loginUser as loginApi, registerUser as registerApi, logoutUser as logoutApi } from "../api/authApi";
import { getCurrentUser } from "../api/userApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!user;

    // On mount, try to restore session
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            getCurrentUser()
                .then((res) => setUser(res.data.data))
                .catch(() => {
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    localStorage.removeItem("user");
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = useCallback(async (credentials) => {
        const res = await loginApi(credentials);
        const { user: userData, accessToken, refreshToken } = res.data.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        return userData;
    }, []);

    const register = useCallback(async (formData) => {
        const res = await registerApi(formData);
        return res.data.data;
    }, []);

    const logout = useCallback(async () => {
        try {
            await logoutApi();
        } catch {
            // ignore errors
        }
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        setUser(null);
    }, []);

    const refreshUser = useCallback(async () => {
        try {
            const res = await getCurrentUser();
            setUser(res.data.data);
        } catch {
            // ignore
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, isAuthenticated, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
    return ctx;
}

export default AuthContext;
