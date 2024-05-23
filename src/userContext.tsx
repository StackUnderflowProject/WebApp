import React, { createContext, useState, useContext, ReactNode } from 'react';
import {jwtDecode} from 'jwt-decode';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type User = {
    _id: string,
    username: string,
    email: string,
    token: string,
    image?: string,
    __v?: number
}

type UserContextType = {
    user: User | null;
    login: (newUser: User | null) => void;
    logout: () => void;
    updateUser: (newUser: User | null) => void;
    isTokenExpired: () => boolean; 
    resetJWT: () => void;
}

export const UserContext = createContext<UserContextType>({
    user: null,
    login: () => {},
    logout: () => {},
    updateUser: () => {},
    isTokenExpired: () => {return true},
    resetJWT: () => {}
});

type UserProviderProps = {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userStored = localStorage.getItem('user');
    if (userStored) {
      try {
        const parsedUser: User = JSON.parse(userStored);
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
  }, []);

  const login = (newUser: User | null) => {
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const updateUser = (newUser: User | null) => {
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  }

  const isTokenExpired = (): boolean => {
    if (user === null || !user.token) return true;

    const decoded: { exp: number } = jwtDecode(user.token);
    const currentTime = Date.now() / 1000;

    return decoded.exp < currentTime + 1;
  };

  const resetJWT = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <UserContext.Provider value={{ user, login, logout, updateUser, isTokenExpired, resetJWT }}>
      {children}
    </UserContext.Provider>
  );
};

// Create a custom hook to use the UserContext
export const useUserContext = () => useContext(UserContext);