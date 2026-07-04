import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Info, X, ShieldAlert } from 'lucide-react';

const NotificationContext = createContext(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setNotifications((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeNotification(id);
    }, duration);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-md w-full pointer-events-none">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, transition: { duration: 0.2 } }}
              className="pointer-events-auto"
            >
              <Toast notification={n} onClose={removeNotification} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

const Toast = ({ notification, onClose }) => {
  const { id, message, type } = notification;

  const iconMap = {
    success: <CheckCircle className="w-5 h-5 text-soc-success shrink-0" />,
    error: <ShieldAlert className="w-5 h-5 text-soc-danger shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-soc-warning shrink-0" />,
    info: <Info className="w-5 h-5 text-soc-accent shrink-0" />,
  };

  const borderMap = {
    success: 'border-soc-success/30 bg-soc-card/90 shadow-soc-success/5',
    error: 'border-soc-danger/30 bg-soc-card/90 shadow-soc-danger/5',
    warning: 'border-soc-warning/30 bg-soc-card/90 shadow-soc-warning/5',
    info: 'border-soc-accent/30 bg-soc-card/90 shadow-soc-accent/5',
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border glass-panel shadow-lg ${borderMap[type]}`}
    >
      <div className="mt-0.5">{iconMap[type] || iconMap.info}</div>
      <div className="flex-1 text-sm font-medium text-soc-text pr-2 leading-relaxed">
        {message}
      </div>
      <button
        onClick={() => onClose(id)}
        className="text-soc-secondary hover:text-soc-text transition-colors p-0.5 rounded-lg hover:bg-white/5 shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
