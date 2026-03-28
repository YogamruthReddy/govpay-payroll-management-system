import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: attach access token ──────────────────────────────────
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ── Response interceptor: auto-refresh on 401 TOKEN_EXPIRED ──────────────────
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve(token!);
    });
    failedQueue = [];
};

api.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        const isTokenExpired =
            error.response?.status === 401 &&
            (error.response?.data as any)?.code === 'TOKEN_EXPIRED' &&
            !originalRequest._retry;

        if (isTokenExpired) {
            if (isRefreshing) {
                // Queue requests while refresh is in progress
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                processQueue(error, null);
                isRefreshing = false;
                localStorage.clear();
                window.location.href = '/';
                return Promise.reject(error);
            }

            try {
                const { data } = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });
                const newToken = data.token;
                localStorage.setItem('token', newToken);
                processQueue(null, newToken);
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                localStorage.clear();
                window.location.href = '/';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

// ── Auth API ──────────────────────────────────────────────────────────────────
export const authAPI = {
    login: async (username: string, password: string) => {
        const response = await api.post('/auth/login', { username, password });
        return response.data;
    },
    register: async (username: string, password: string, email: string, role: string) => {
        const response = await api.post('/auth/register', { username, password, email, role });
        return response.data;
    },
    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },
    logout: async (refreshToken: string) => {
        await api.post('/auth/logout', { refreshToken });
    },
    refreshToken: async (refreshToken: string) => {
        const response = await api.post('/auth/refresh-token', { refreshToken });
        return response.data;
    },
};

// ── Employee API ──────────────────────────────────────────────────────────────
export const employeeAPI = {
    getAll: async () => { const r = await api.get('/employees'); return r.data; },
    getById: async (id: number) => { const r = await api.get(`/employees/${id}`); return r.data; },
    create: async (data: any) => { const r = await api.post('/employees', data); return r.data; },
    update: async (id: number, data: any) => { const r = await api.put(`/employees/${id}`, data); return r.data; },
    delete: async (id: number) => { const r = await api.delete(`/employees/${id}`); return r.data; },
    getServiceHistory: async (id: number) => { const r = await api.get(`/employees/${id}/service-history`); return r.data; },
    addServiceHistory: async (id: number, data: any) => { const r = await api.post(`/employees/${id}/service-history`, data); return r.data; },
};

// ── Payroll API ───────────────────────────────────────────────────────────────
export const payrollAPI = {
    // Unwrap { success, payrolls } → return raw array for backward compat
    getAll: async () => { const r = await api.get('/payroll'); return r.data.payrolls ?? r.data; },
    getByEmployee: async (employeeId: number) => { const r = await api.get(`/payroll/employee/${employeeId}`); return r.data.payrolls ?? r.data; },
    getById: async (id: number) => { const r = await api.get(`/payroll/${id}`); return r.data.payroll ?? r.data; },
    create: async (data: any) => { const r = await api.post('/payroll', data); return r.data; },
    markPaid: async (id: number) => { const r = await api.patch(`/payroll/${id}/mark-paid`); return r.data; },
    downloadPayslip: async (id: number) => {
        const response = await api.get(`/payroll/payslip/${id}`, { responseType: 'blob' });
        return response;
    },
};

// ── Leave API ─────────────────────────────────────────────────────────────────
export const leaveAPI = {
    // Unwrap { success, leaves } → return raw array for backward compat
    getPending: async () => { const r = await api.get('/leaves/pending'); return r.data.leaves ?? r.data; },
    getAll: async () => { const r = await api.get('/leaves/all'); return r.data.leaves ?? r.data; },
    getByEmployee: async (employeeId: number) => { const r = await api.get(`/leaves/employee/${employeeId}`); return r.data.leaves ?? r.data; },
    apply: async (data: any) => { const r = await api.post('/leaves', data); return r.data; },
    updateStatus: async (id: number, status: string) => { const r = await api.put(`/leaves/${id}/status`, { status }); return r.data; },
};

// ── Analytics API ─────────────────────────────────────────────────────────────
export const analyticsAPI = {
    getDashboard: async () => { const r = await api.get('/analytics/dashboard'); return r.data; },
    getTopEarners: async () => { const r = await api.get('/analytics/top-earners'); return r.data; },
    getAnomalies: async () => { const r = await api.get('/analytics/anomalies'); return r.data; },
    getLeaveAnalytics: async () => { const r = await api.get('/analytics/leave-analytics'); return r.data; },
};

// ── Payroll Rules API ─────────────────────────────────────────────────────────
export const payrollRulesAPI = {
    getAll: async () => { const r = await api.get('/payroll-rules'); return r.data; },
    create: async (data: { name: string; type: string; calculation: string; value: number }) => {
        const r = await api.post('/payroll-rules', data);
        return r.data;
    },
    toggle: async (id: number) => { const r = await api.patch(`/payroll-rules/${id}/toggle`); return r.data; },
    delete: async (id: number) => { const r = await api.delete(`/payroll-rules/${id}`); return r.data; },
};

export default api;
