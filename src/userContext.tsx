import React, { createContext, useState, useContext, ReactNode } from 'react';
import {jwtDecode} from 'jwt-decode';

type User = {
    _id: string,
    username: string,
    email: string,
    image?: string,
    __v?: number
}

type UserContextType = {
    user: User | null;
    setUserContext: (user: User | null) => void;
}

export const UserContext = createContext<UserContextType>({
    user: null,
    setUserContext: () => {}
});

type UserProviderProps = {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const setUserContext = (newUser: User | null) => {
    setUser(newUser);
  };

  return (
    <UserContext.Provider value={{ user, setUserContext }}>
      {children}
    </UserContext.Provider>
  );
};

// Create a custom hook to use the UserContext
export const useUserContext = () => useContext(UserContext);



// JWT Context

type JWTContextType = {
    token: string | null;
    setToken: (token: string | null) => void;
    isTokenExpired: () => boolean;
};
  
export const JWTContext = createContext<JWTContextType>({
    token: null,
    setToken: () => {},
    isTokenExpired: () => true
});
  
export const JWTProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
  
    const isTokenExpired = (): boolean => {
      if (!token) return true;
  
      const decoded: { exp: number } = jwtDecode(token);
      const currentTime = Date.now() / 1000;
  
      return decoded.exp < currentTime;
    };
  
    return (
      <JWTContext.Provider value={{ token, setToken, isTokenExpired }}>
        {children}
      </JWTContext.Provider>
    );
};

export const useJWTContext = () => useContext(JWTContext);
