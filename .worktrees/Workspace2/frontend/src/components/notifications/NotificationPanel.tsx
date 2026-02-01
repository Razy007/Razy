
import React, { useEffect, useState } from 'react';
import { Bell, X, Info, AlertTriangle, CheckCircle, Ban } from 'lucide-react';
import { ApiService } from '../../services/ApiService';


interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'ban';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onUnreadCountChange?: (count: number) => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose, onUnreadCountChange }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await ApiService.getNotifications();
        if (res.data.success) {
          setNotifications(res.data.notifications);
          const unread = res.data.notifications.filter((n: Notification) => !n.isRead).length;
          if (onUnreadCountChange) onUnreadCountChange(unread);
        }
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, onUnreadCountChange]);

  const handleMarkRead = async (id: string) => {
    try {
      // Optimistic update
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      
      await ApiService.markNotificationRead(id);
      
      const unread = notifications.filter(n => !n.isRead && n.id !== id).length;
      if (onUnreadCountChange) onUnreadCountChange(unread);
      
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="text-yellow-500 w-5 h-5" />;
      case 'success': return <CheckCircle className="text-green-500 w-5 h-5" />;
      case 'ban': return <Ban className="text-red-500 w-5 h-5" />;
      default: return <Info className="text-blue-500 w-5 h-5" />;
    }
  };

  const getBgColor = (type: string) => {
     switch (type) {
      case 'warning': return 'bg-yellow-500/10 border-yellow-500/20';
      case 'success': return 'bg-green-500/10 border-green-500/20';
      case 'ban': return 'bg-red-500/10 border-red-500/20';
      default: return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-md bg-[#0f172a] h-full shadow-2xl border-l border-white/10 flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0f172a]">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Bell className="w-5 h-5 text-yellow-500" />
            Notifications
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
             <div className="text-center py-10 text-white/30">Chargement...</div>
          ) : notifications.length === 0 ? (
             <div className="text-center py-10 text-white/30 flex flex-col items-center gap-3">
               <Bell className="w-12 h-12 opacity-20" />
               <p>Aucune notification pour le moment.</p>
             </div>
          ) : (
            notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`p-4 rounded-xl border ${getBgColor(notification.type)} relative group transition-all`}
              >
                {!notification.isRead && (
                   <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-yellow-500" />
                )}
                
                <div className="flex gap-3">
                   <div className="mt-1">{getIcon(notification.type)}</div>
                   <div className="flex-1">
                      <h3 className="font-bold text-sm mb-1">{notification.title}</h3>
                      <p className="text-xs text-white/70 leading-relaxed">{notification.message}</p>
                      <p className="text-[10px] text-white/30 mt-2">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                   </div>
                </div>

                {!notification.isRead && (
                   <button 
                     onClick={() => handleMarkRead(notification.id)}
                     className="mt-3 text-[10px] uppercase font-bold tracking-wider text-white/40 hover:text-white transition-colors w-full text-right"
                   >
                     Marquer comme lu
                   </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
