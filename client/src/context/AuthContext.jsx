/* eslint-disable react-refresh/only-export-components */

import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Kita perlu install library ini

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Cek token saat aplikasi pertama kali dimuat
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
        } catch (error) {
            console.error("Token tidak valid atau korup:", error); // <-- TAMBAHKAN BARIS INI
            // Jika token tidak valid, hapus dari local storage
            localStorage.removeItem('token');
        }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    const decodedUser = jwtDecode(token);
    setUser(decodedUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};