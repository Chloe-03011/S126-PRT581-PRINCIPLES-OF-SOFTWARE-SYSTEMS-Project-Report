import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';
import { io } from 'socket.io-client';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [socket, setSocket] = useState(null);

    const fetchNotifications = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const response = await api.get('/notifications');
            setNotifications(Array.isArray(response.data) ? response.data : []);
            const countRes = await api.get('/notifications/unread-count');
            setUnreadCount(countRes.data.count || 0);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    // Socket implementation
    useEffect(() => {
        if (user) {
            const newSocket = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:5000', {
                withCredentials: true
            });

            newSocket.on('connect', () => {
                console.log('Connected to socket server');
                newSocket.emit('join', user.id || user._id);
            });

            newSocket.on('new_notification', (notification) => {
                console.log('New notification received:', notification);
                setNotifications(prev => {
                    const current = Array.isArray(prev) ? prev : [];
                    return [notification, ...current];
                });
                setUnreadCount(prev => (prev || 0) + 1);
                
                // Show browser notification if permitted
                if (Notification.permission === 'granted') {
                    new Notification(notification.title, {
                        body: notification.message,
                        icon: '/favicon.svg'
                    });
                }
            });

            setSocket(newSocket);

            return () => newSocket.close();
        }
    }, [user]);

    // Request browser notification permission
    useEffect(() => {
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }
    }, []);

    const markAsRead = async (id) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(prev => {
                if (!Array.isArray(prev)) return [];
                return prev.map(n => n._id === id ? { ...n, isRead: true } : n);
            });
            setUnreadCount(prev => Math.max(0, (prev || 0) - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.patch('/notifications/read-all');
            setNotifications(prev => {
                if (!Array.isArray(prev)) return [];
                return prev.map(n => ({ ...n, isRead: true }));
            });
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await api.delete(`/notifications/${id}`);
            setNotifications(prev => {
                if (!Array.isArray(prev)) return [];
                const wasUnread = prev.find(n => n._id === id && !n.isRead);
                if (wasUnread) setUnreadCount(c => Math.max(0, (c || 0) - 1));
                return prev.filter(n => n._id !== id);
            });
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            loading,
            fetchNotifications,
            markAsRead,
            markAllAsRead,
            deleteNotification
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
