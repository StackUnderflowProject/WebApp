import React, { createContext, useState, useContext, ReactNode } from 'react';
import {jwtDecode} from 'jwt-decode';

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
    setUserContext: (user: User | null) => void;
    isTokenExpired: () => boolean; 
}

export const UserContext = createContext<UserContextType>({
    user: null,
    setUserContext: () => {},
    isTokenExpired: () => {return true}
});

type UserProviderProps = {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const setUserContext = (newUser: User | null) => {
    setUser(newUser);
  };

  const isTokenExpired = (): boolean => {
    if (user === null || !user.token) return true;

    const decoded: { exp: number } = jwtDecode(user.token);
    const currentTime = Date.now() / 1000;

    return decoded.exp < currentTime;
  };

  return (
    <UserContext.Provider value={{ user, setUserContext, isTokenExpired }}>
      {children}
    </UserContext.Provider>
  );
};

// Create a custom hook to use the UserContext
export const useUserContext = () => useContext(UserContext);