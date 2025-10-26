'use client';
import React from 'react';
import API_ROUTES, { API_KEYS } from '../config/api-routes';
import api from './AxiosInterceptor';
import { useApiQuery } from './useApiQuery';

const useSenders = () => {
    
    const fetchSendersList = async () => {
        try {
            const res = await api.get(`${API_ROUTES.CAMPAIGN.GETALLSENDERS}`);
            console.log('console log in senders',res.data)
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const { data, isPending, isError, error, refetch, ...options } = useApiQuery([API_KEYS.CAMPAIGN.GETSENDERNAMES], fetchSendersList, {});

    return { data, isPending, isError, error, refetch, ...options };
};

export default useSenders;
