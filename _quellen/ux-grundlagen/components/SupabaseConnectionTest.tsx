import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export const SupabaseConnectionTest = () => {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // 1. Check Auth Connection (doesn't need login, just checks connectivity)
        const { error: authError } = await supabase.auth.getSession();
        if (authError) throw authError;

        // 2. Check Server Health
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-74d94287/health`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        });
        if (!response.ok) throw new Error('Server health check failed');
        
        setStatus('connected');
        setMessage('System operational (Supabase & Server)');
      } catch (err: unknown) {
        console.error('Supabase connection error:', err);
        setStatus('error');
        setMessage(err instanceof Error ? err.message : 'Connection failed');
      }
    };

    checkConnection();
  }, []);

  if (status === 'loading') return <div className="text-xs text-stone-400 animate-pulse">System check...</div>;

  return (
    <div className={`flex items-center gap-2 text-xs font-medium ${status === 'connected' ? 'text-emerald-600' : 'text-red-600'}`}>
      <div className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-emerald-500' : 'bg-red-500'} shadow-sm`} />
      <span>{message}</span>
    </div>
  );
};
