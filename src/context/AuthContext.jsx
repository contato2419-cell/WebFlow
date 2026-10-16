import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSupabaseClient } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('vitrixflow_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          name: 'Ygor Souza',
          handle: '@ygorweb',
          avatar: '/avatar_ygorweb.jpg'
        };
      } catch (e) {
        return null;
      }
    }
    // Default initial user with real Instagram profile photo
    return {
      id: 'usr_owner_default',
      name: 'Ygor Souza',
      email: 'contato2419@gmail.com',
      handle: '@ygorweb',
      workspace: 'VitrixFlow Workspace',
      avatar: '/avatar_ygorweb.jpg'
    };
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('vitrixflow_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('vitrixflow_current_user');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const loggedUser = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || email.split('@')[0],
          workspace: 'Vitrix Workspace Principal',
          avatar: data.user.user_metadata?.avatar || '/avatar_ygorweb.jpg'
        };
        setUser(loggedUser);
        return { success: true };
      } else {
        // Fallback local auth
        const localUser = {
          id: 'usr_' + Math.random().toString(36).substring(2, 9),
          name: email.split('@')[0],
          email,
          workspace: 'VitrixFlow Workspace',
          avatar: '/avatar_ygorweb.jpg'
        };
        setUser(localUser);
        return { success: true };
      }
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } }
        });
        if (error) throw error;
        const newUser = {
          id: data.user?.id || 'usr_' + Date.now(),
          name,
          email,
          workspace: `${name} Workspace`,
          avatar: '/avatar_ygorweb.jpg'
        };
        setUser(newUser);
        return { success: true };
      } else {
        const newUser = {
          id: 'usr_' + Math.random().toString(36).substring(2, 9),
          name,
          email,
          workspace: `${name} Workspace`,
          avatar: '/avatar_ygorweb.jpg'
        };
        setUser(newUser);
        return { success: true };
      }
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    const supabase = getSupabaseClient();
    if (supabase) supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
