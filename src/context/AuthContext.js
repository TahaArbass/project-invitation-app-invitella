import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(() => {
        const storedUser = localStorage.getItem('currentUser');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return !!localStorage.getItem('isLoggedIn');
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const updateUserState = () => {
            if (currentUser) {
                setIsLoggedIn(true);
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                localStorage.setItem('isLoggedIn', true);
            } else {
                setIsLoggedIn(false);
                localStorage.removeItem('currentUser');
                localStorage.removeItem('isLoggedIn');
            }
            setLoading(false);
        };

        updateUserState();
    }, [currentUser]);

    const value = {
        currentUser,
        setCurrentUser,
        isLoggedIn,
        setIsLoggedIn,
        loading,
        setLoading,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
