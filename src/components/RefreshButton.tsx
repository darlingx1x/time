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
        className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 disabled:opacity-50"
      >
        {isRefreshing ? 'Обновление...' : 'Обновить страницу'}
      </button>
      
      <button 
        onClick={() => window.location.href = '/articles?v=' + Date.now()}
        className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
      >
        Принудительное обновление
      </button>
    </div>
  );
} 