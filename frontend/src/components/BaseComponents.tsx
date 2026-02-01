import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl ${className}`}
  >
    {children}
  </div>
);

export const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'premium';
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}> = ({ children, onClick, variant = 'primary', disabled = false, className = '', type = "button" }) => {
  const baseClasses = 'px-6 py-4 rounded-2xl font-black uppercase tracking-[0.1em] text-xs transition-all duration-300 flex items-center justify-center gap-3 active:scale-95';
  const variants = {
    primary: 'bg-yellow-500 text-black hover:bg-yellow-400 shadow-lg shadow-yellow-500/20 disabled:opacity-50 disabled:bg-gray-700',
    secondary: 'bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-30',
    danger: 'bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white',
    premium: 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black hover:brightness-110 shadow-xl shadow-yellow-500/30'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {children}
    </button>
  );
};

export const StatusBadge: React.FC<{ status: 'pending' | 'approved' | 'completed' | 'failed' | string }> = ({ status }) => {
  const normalizedStatus = status?.toLowerCase() as 'pending' | 'approved' | 'completed' | 'failed';
  
  const styles = {
    pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    approved: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    completed: 'bg-green-500/10 text-green-500 border-green-500/20',
    failed: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  const labels = {
    pending: 'En attente',
    approved: 'Approuvé',
    completed: 'Complété',
    failed: 'Échoué',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${styles[normalizedStatus] || styles.pending}`}>
      {labels[normalizedStatus] || status}
    </span>
  );
};
