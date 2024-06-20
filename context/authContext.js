import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig"; // Import Firebase auth and Firestore instances
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Create context for authentication
export const AuthContext = createContext();

// AuthContextProvider component to provide authentication context to children
export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null); // State to store current user
    const [isAuthenticated, setIsAuthenticated] = useState(undefined); // State to track authentication status

    // Effect hook to listen for authentication state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
                setUser(user);
                updateUserData(user.uid); // Update user data when authenticated
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        });

        // Clean up function to unsubscribe when component unmounts
        return unsubscribe;
    }, []);

    // Function to update user data from Firestore
    const updateUserData = async (userId) => {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            setUser({ ...user, username: data.username, employeeID: data.employeeID, userId: data.userId });
        }
    }

    // Function to handle user login
    const login = async (email, password) => {
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            return { success: true, data: response.user };
        } catch (error) {
            console.error("Login Error:", error);
            let msg = error.message;
            // Handle specific error messages
            if (msg.includes('(auth/invalid-email)')) {
                msg = 'Invalid email';
            } else if (msg.includes('(auth/wrong-password)')) {
                msg = 'Incorrect password';
            }
            return { success: false, msg };
        }
    }

    // Function to handle user registration
    const register = async (email, password, username, employeeID) => {
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);

            // Create user document in Firestore
            await setDoc(doc(db, "users", response.user.uid), {
                employeeID,
                username,
                userId: response.user.uid
            });

            return { success: true, data: response.user };
        } catch (error) {
            console.error("Registration Error:", error);
            let msg = error.message;
            // Handle specific error messages
            if (msg.includes('(auth/invalid-email)')) {
                msg = 'Invalid email';
            } else if (msg.includes('(auth/email-already-in-use)')) {
                msg = 'Email address is already in use. Please use a different email address.';
            }
            return { success: false, msg };
        }
    }

    // Function to handle user logout
    const logout = async () => {
        try {
            await auth.signOut();
        } catch (error) {
            console.error("Logout Error:", error);
        }
    }

    // Provide authentication context values to children components
    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use authentication context values
export const useAuth = () => {
    const value = useContext(AuthContext);

    if (!value) {
        throw new Error('useAuth must be used within an AuthContextProvider');
    }

    return value;
}
