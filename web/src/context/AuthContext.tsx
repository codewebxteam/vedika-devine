"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User as FirebaseUser } from "firebase/auth";
import {
  auth,
  subscribeToAuthChanges,
  loginUser as apiLoginUser,
  registerUser as apiRegisterUser,
  registerAdminUser as apiRegisterAdminUser,
  resetPassword as apiResetPassword,
  loginWithGoogle as apiLoginWithGoogle,
  logoutUser as apiLogoutUser,
  getUserProfile,
  ensureUserDocumentInFirestore,
  registerDealerPartner,
  updateUserProfileData,
  saveUserAddress,
  deleteUserAddress,
  setDefaultAddress,
  DealerRegistrationData,
  UserProfile,
  Address,
} from "@backend/index";

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  isDealer: boolean;
  isDealerPending: boolean;
  isCustomer: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string) => Promise<void>;
  registerAdmin: (email: string, pass: string, name: string) => Promise<UserProfile>;
  resetPasswordLink: (email: string) => Promise<void>;
  registerDealer: (data: DealerRegistrationData) => Promise<UserProfile>;
  loginGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfileData: (data: { displayName?: string; phoneNumber?: string }) => Promise<void>;
  addOrUpdateAddress: (address: Address) => Promise<void>;
  removeAddress: (addressId: string) => Promise<void>;
  makeAddressDefault: (addressId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isAdmin: false,
  isDealer: false,
  isDealerPending: false,
  isCustomer: true,
  loading: true,
  login: async () => {},
  register: async () => {},
  registerAdmin: async () => ({} as UserProfile),
  resetPasswordLink: async () => {},
  registerDealer: async () => ({} as UserProfile),
  loginGoogle: async () => {},
  logout: async () => {},
  refreshProfile: async () => {},
  updateProfileData: async () => {},
  addOrUpdateAddress: async () => {},
  removeAddress: async () => {},
  makeAddressDefault: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid: string, fbUser?: FirebaseUser) => {
    try {
      let p = await getUserProfile(uid);
      if (!p && fbUser) {
        p = await ensureUserDocumentInFirestore(fbUser);
      }
      setProfile(p);
    } catch (e) {
      console.warn("Could not fetch user profile:", e);
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchProfile(firebaseUser.uid, firebaseUser);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    const loggedUser = await apiLoginUser(email, pass);
    setUser(loggedUser);
    await fetchProfile(loggedUser.uid, loggedUser);
  };

  const register = async (email: string, pass: string, name: string) => {
    const userProfile = await apiRegisterUser(email, pass, name);
    setProfile(userProfile);
  };

  const registerAdmin = async (email: string, pass: string, name: string) => {
    const adminProfile = await apiRegisterAdminUser(email, pass, name);
    setProfile(adminProfile);
    return adminProfile;
  };

  const resetPasswordLink = async (email: string) => {
    await apiResetPassword(email);
  };

  const registerDealer = async (data: DealerRegistrationData) => {
    const dealerProfile = await registerDealerPartner(data);
    setProfile(dealerProfile);
    return dealerProfile;
  };

  const loginGoogle = async () => {
    const userProfile = await apiLoginWithGoogle();
    setProfile(userProfile);
  };

  const logout = async () => {
    await apiLogoutUser();
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.uid, user);
    }
  };

  const updateProfileData = async (data: { displayName?: string; phoneNumber?: string }) => {
    if (!user) return;
    const updated = await updateUserProfileData(user.uid, data);
    setProfile(updated);
  };

  const addOrUpdateAddress = async (address: Address) => {
    if (!user) return;
    const updatedAddresses = await saveUserAddress(user.uid, address);
    setProfile((prev) => (prev ? { ...prev, addresses: updatedAddresses } : prev));
  };

  const removeAddress = async (addressId: string) => {
    if (!user) return;
    const updatedAddresses = await deleteUserAddress(user.uid, addressId);
    setProfile((prev) => (prev ? { ...prev, addresses: updatedAddresses } : prev));
  };

  const makeAddressDefault = async (addressId: string) => {
    if (!user) return;
    const updatedAddresses = await setDefaultAddress(user.uid, addressId);
    setProfile((prev) => (prev ? { ...prev, addresses: updatedAddresses } : prev));
  };

  const isAdmin = profile?.role === "admin";
  const isDealer = profile?.role === "dealer";
  const isDealerPending = profile?.role === "dealer_pending";
  const isCustomer = profile?.role === "customer" || !profile?.role;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAdmin,
        isDealer,
        isDealerPending,
        isCustomer,
        loading,
        login,
        register,
        registerAdmin,
        resetPasswordLink,
        registerDealer,
        loginGoogle,
        logout,
        refreshProfile,
        updateProfileData,
        addOrUpdateAddress,
        removeAddress,
        makeAddressDefault,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
