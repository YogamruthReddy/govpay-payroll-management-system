import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// API methods
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
};

export const employeeAPI = {
    getAll: async () => {
        const response = await api.get('/employees');
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get(`/employees/${id}`);
        return response.data;
    },

    create: async (data: any) => {
        const response = await api.post('/employees', data);
        return response.data;
    },

    update: async (id: number, data: any) => {
        const response = await api.put(`/employees/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await api.delete(`/employees/${id}`);
        return response.data;
    },

    getServiceHistory: async (id: number) => {
        const response = await api.get(`/employees/${id}/service-history`);
        return response.data;
    },

    addServiceHistory: async (id: number, data: any) => {
        const response = await api.post(`/employees/${id}/service-history`, data);
        return response.data;
    },
};

export const payrollAPI = {
    getAll: async () => {
        const response = await api.get('/payroll');
        return response.data;
    },

    getByEmployee: async (employeeId: number) => {
        const response = await api.get(`/payroll/employee/${employeeId}`);
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get(`/payroll/${id}`);
        return response.data;
    },

    create: async (data: any) => {
        const response = await api.post('/payroll', data);
        return response.data;
    },

    downloadPayslip: async (id: number) => {
        const response = await api.get(`/payroll/payslip/${id}`, {
            responseType: 'blob',
        });
        return response;
    },
};

export const leaveAPI = {
    getPending: async () => {
        const response = await api.get('/leaves/pending');
        return response.data;
    },

    getByEmployee: async (employeeId: number) => {
        const response = await api.get(`/leaves/employee/${employeeId}`);
        return response.data;
    },

    apply: async (data: any) => {
        const response = await api.post('/leaves', data);
        return response.data;
    },

    updateStatus: async (id: number, status: string) => {
        const response = await api.put(`/leaves/${id}/status`, { status });
        return response.data;
    },
};

export const analyticsAPI = {
    getDashboard: async () => {
        const response = await api.get('/analytics/dashboard');
        return response.data;
    }
};

export default api;
