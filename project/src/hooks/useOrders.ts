import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { useAuth } from './useAuth';

export interface Order {
    _id: string;
    orderNumber: string;
    items: {
        product: {
            _id: string;
            name: string;
            image_url: string;
            price: number;
        };
        quantity: number;
        price: number;
    }[];
    totalAmount: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: string;
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
}

export function useOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const fetchOrders = useCallback(async () => {
        if (!user) {
            setOrders([]);
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.get('/orders');
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const createOrder = async (shippingAddress: any) => {
        try {
            const { data } = await api.post('/orders', { shippingAddress });
            await fetchOrders();
            return { success: true, order: data };
        } catch (error) {
            console.error('Error creating order:', error);
            return { success: false, error };
        }
    };

    return {
        orders,
        loading,
        fetchOrders,
        createOrder
    };
}
