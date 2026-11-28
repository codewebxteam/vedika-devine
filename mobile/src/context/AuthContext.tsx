import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "../config/firebase";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber?: string | null;
  role?: "customer" | "dealer" | "admin" | "dealer_pending";
  dealerInfo?: {
    businessName: string;
    contactPerson: string;
    phone: string;
    city: string;
    commissionRate?: number;
    assignedTerritory?: string;
    status: "pending" | "approved" | "rejected";
  };
  addresses?: Array<{
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  }>;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isDealer: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const AUTH_STORAGE_KEY = "@vedika_auth_profile";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid: string): Promise<UserProfile | null> => {
    try {
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
        return data;
      }
    } catch (e) {
      console.warn("Could not fetch remote profile:", e);
      // Fallback to cached profile
      const cached = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (cached) return JSON.parse(cached);
    }
    return null;
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const p = await fetchProfile(currentUser.uid);
        setProfile(p);
      } else {
        setProfile(null);
        await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const login = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
    const p = await fetchProfile(cred.user.uid);
    setProfile(p);
  };

  const register = async (email: string, pass: string, name: string, phone: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    await updateProfile(cred.user, { displayName: name.trim() });

    const newProfile: UserProfile = {
      uid: cred.user.uid,
      email: cred.user.email,
      displayName: name.trim(),
      phoneNumber: phone.trim(),
      role: "customer",
    };

    await setDoc(doc(db, "users", cred.user.uid), newProfile);
    setProfile(newProfile);
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newProfile));
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setProfile(null);
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const refreshProfile = async () => {
    if (user) {
      const p = await fetchProfile(user.uid);
      setProfile(p);
    }
  };

  const isDealer = profile?.role === "dealer";
  const isAdmin = profile?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isDealer,
        isAdmin,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
