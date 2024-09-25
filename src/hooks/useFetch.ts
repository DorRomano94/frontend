import { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';

export const useFetch = (url: string, isAuthenticated: boolean, config?: object) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null); 
    
    useEffect(() => {        
        const fetchData = async () => {
            if (!isAuthenticated) return;
            try {
                const response = await axiosInstance.get(url, config);
                setData(response.data);
                setError(null);
            } catch (error) {
                console.error(`Error fetching data from ${url}:`, error);
                setData(null);
                setError('Failed to fetch data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url, isAuthenticated, config]);

    return { data, loading, error };
};
