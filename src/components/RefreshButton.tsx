'use client';

import { useState } from 'react';

export default function RefreshButton() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    try {
      // Обновляем кэш через API
      await fetch('/api/refresh-cache', { method: 'POST' });
      
      // Принудительно обновляем страницу
      window.location.reload();
    } catch (error) {
      console.error('Ошибка обновления:', error);
      // В случае ошибки все равно обновляем страницу
      window.location.reload();
    }
  };

  return (
    <div className="flex gap-2">
      <button 
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="px-5 py-2 rounded-full bg-black text-white text-sm font-medium shadow-softMd transition hover:bg-gray-800 disabled:opacity-50"
      >
        {isRefreshing ? 'Обновление...' : 'Обновить страницу'}
      </button>
      
      <button 
        onClick={() => window.location.href = '/articles?v=' + Date.now()}
        className="px-5 py-2 rounded-full border border-black text-black text-sm font-medium bg-white shadow-softMd transition hover:bg-gray-100"
      >
        Принудительное обновление
      </button>
    </div>
  );
} 