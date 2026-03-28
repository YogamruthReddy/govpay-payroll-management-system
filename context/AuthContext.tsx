import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { authAPI } from '../services/api';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Check for existing token on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const userData = await authAPI.getCurrentUser();
                    setUser({
                        id: userData.employee?.id?.toString() || userData.id.toString(),
                        name: userData.employee?.name || userData.username,
                        role: userData.role as UserRole,
                        department: userData.employee?.department,
                        position: userData.employee?.position,
                    });
                } catch (err) {
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (username: string, password: string) => {
        try {
            setError(null);
            setLoading(true);
            const response = await authAPI.login(username, password);

            // Store token
            localStorage.setItem('token', response.token);

            // Set user data
            setUser({
                id: response.user.employee?.id?.toString() || response.user.id.toString(),
                name: response.user.employee?.name || response.user.username,
                role: response.user.role as UserRole,
                department: response.user.employee?.department,
                position: response.user.employee?.position,
            });
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
