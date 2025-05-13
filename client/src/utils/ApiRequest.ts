import axios, { AxiosRequestConfig } from 'axios';

const getHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};

const getRequest = async (url: string, config?: AxiosRequestConfig) => {
    try {
        const response = await axios.get(url, {
            ...config,
            headers: getHeaders(),
            withCredentials: true, // Include credentials
        });
        return response;
    } catch (error: any) {
        console.error('GET Request Error:', error);
        throw error.response?.data || error.message;
    }
};

const postRequest = async (url: string, data?: any, config?: AxiosRequestConfig) => {
    try {
        const response = await axios.post(url, JSON.stringify(data), {
            ...config,
            headers: getHeaders(),
            withCredentials: true, // Include credentials
        });
        return response;
    } catch (error: any) {
        console.error('POST Request Error:', error);
        throw error.response?.data || error.message;
    }
};

const putRequest = async (url: string, data?: any, config?: AxiosRequestConfig) => {
    try {
        const response = await axios.put(url, data, {
            ...config,
            headers: getHeaders(),
            withCredentials: true, // Include credentials
        });
        return response.data;
    } catch (error: any) {
        console.error('PUT Request Error:', error);
        throw error.response?.data || error.message;
    }
};

const deleteRequest = async (url: string, config?: AxiosRequestConfig) => {
    try {
        const response = await axios.delete(url, {
            ...config,
            headers: getHeaders(),
            withCredentials: true, // Include credentials
        });
        return response.data;
    } catch (error: any) {
        console.error('DELETE Request Error:', error);
        throw error.response?.data || error.message;
    }
};

export { getRequest, postRequest, putRequest, deleteRequest };