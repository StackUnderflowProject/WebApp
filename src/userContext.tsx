import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

// Async function to check if user is admin
const isAdmin = async (jwtToken: string): Promise<boolean> => {
    const response = await fetch("http://localhost:3000/admins/isAdmin", {
        headers: {
            'Authorization': 'Bearer ' + jwtToken
        }
    });
    if (response.ok) {
        const json = await response.json();
        return json.isAdmin;
    }
    return false;
}

type User = {
    _id: string,
    username: string,
    email: string,
    token: string,
    image?: string,
    __v?: number,
    isAdmin?: boolean,
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
    isTokenExpired: () => true,
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

    const login = async (newUser: User | null) => {
        if (newUser !== null) {
            newUser.isAdmin = await isAdmin(newUser.token);
            localStorage.setItem('user', JSON.stringify(newUser));
            setUser(newUser);
            const storedPath = localStorage.getItem("lastPath");
            const lastPath = (storedPath && storedPath !== "/register") ? storedPath : "/";
            navigate(lastPath);
        } else {
            localStorage.removeItem('user');
            setUser(null);
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    const updateUser = (newUser: User | null) => {
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
    };

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
