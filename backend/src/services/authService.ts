import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import { auth, db, googleProvider } from "../config/firebase";
import { COLLECTIONS } from "../config/constants";
import { UserProfile, Address, UserRole, DealerInfo } from "../types/user";

/**
 * Ensures a document exists in the Firestore 'users' collection for the user.
 * Stores 'role: customer' by default. You can change this to 'admin' in Firestore Console.
 */
export const ensureUserDocumentInFirestore = async (
  firebaseUser: FirebaseUser,
  customDisplayName?: string
): Promise<UserProfile> => {
  const docRef = doc(db, COLLECTIONS.USERS, firebaseUser.uid);
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
  } catch (err) {
    console.warn("Could not read user doc from Firestore:", err);
  }

  // If document does not exist yet, create it!
  const newProfile: UserProfile = {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: customDisplayName || firebaseUser.displayName || "Valued Customer",
    photoURL: firebaseUser.photoURL || null,
    phoneNumber: firebaseUser.phoneNumber || null,
    role: "customer", // Set to "admin" in Firebase Console to grant admin access!
    addresses: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  try {
    await setDoc(docRef, newProfile);
  } catch (err) {
    console.warn("Could not create user document in Firestore:", err);
  }

  return newProfile;
};

export const registerUser = async (
  email: string,
  pass: string,
  displayName: string
): Promise<UserProfile> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  const firebaseUser = userCredential.user;

  try {
    await updateProfile(firebaseUser, { displayName });
  } catch (e) {
    console.warn("Could not set displayName on auth user:", e);
  }

  return await ensureUserDocumentInFirestore(firebaseUser, displayName);
};

export const loginUser = async (email: string, pass: string): Promise<FirebaseUser> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  const firebaseUser = userCredential.user;

  // Auto-sync document in 'users' collection on login
  await ensureUserDocumentInFirestore(firebaseUser);

  return firebaseUser;
};

export const loginWithGoogle = async (): Promise<UserProfile> => {
  const userCredential = await signInWithPopup(auth, googleProvider);
  return await ensureUserDocumentInFirestore(userCredential.user);
};

export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.USERS, uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const updateUserRole = async (
  uid: string,
  role: UserRole
): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.USERS, uid);
  await updateDoc(docRef, {
    role,
    updatedAt: Date.now(),
  });
};

export interface DealerRegistrationData {
  email: string;
  password: string;
  businessName: string;
  contactPerson: string;
  phone: string;
  city: string;
  state?: string;
  gstNumber?: string;
  estimatedMonthlyVolume?: string;
  notes?: string;
}

/**
 * Register as a Wholesale Dealer / Partner.
 * Creates Firebase Auth credentials and sets Firestore role to 'dealer_pending'.
 * Admin must approve before dealer access is granted.
 */
export const registerDealerPartner = async (
  data: DealerRegistrationData
): Promise<UserProfile> => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    data.email,
    data.password
  );
  const firebaseUser = userCredential.user;

  try {
    await updateProfile(firebaseUser, { displayName: data.contactPerson });
  } catch (e) {
    console.warn("Could not set displayName on dealer auth user:", e);
  }

  const dealerInfo: DealerInfo = {
    businessName: data.businessName,
    contactPerson: data.contactPerson,
    phone: data.phone,
    city: data.city,
    state: data.state || "",
    gstNumber: data.gstNumber || "",
    estimatedMonthlyVolume: data.estimatedMonthlyVolume || "20+ Master Cartons",
    status: "pending",
    appliedAt: Date.now(),
    notes: data.notes || "",
  };

  const docRef = doc(db, COLLECTIONS.USERS, firebaseUser.uid);
  const dealerProfile: UserProfile = {
    uid: firebaseUser.uid,
    email: data.email,
    displayName: data.contactPerson,
    phoneNumber: data.phone,
    photoURL: null,
    role: "dealer_pending",
    dealerInfo,
    addresses: [
      {
        fullName: data.contactPerson,
        phone: data.phone,
        street: data.businessName,
        city: data.city,
        state: data.state || "Uttar Pradesh",
        pincode: "000000",
        isDefault: true,
      },
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  await setDoc(docRef, dealerProfile);
  return dealerProfile;
};

/**
 * Admin action: Approve dealer partner account.
 * Immediately elevates role to 'dealer' and marks dealerStatus as 'approved'.
 */
export const approveDealerAccount = async (uid: string): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.USERS, uid);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) throw new Error("Dealer account not found");

  const current = docSnap.data() as UserProfile;
  const currentDealerInfo = current.dealerInfo || {
    businessName: current.displayName || "Dealer Store",
    contactPerson: current.displayName || "Owner",
    phone: current.phoneNumber || "",
    city: "India",
    appliedAt: Date.now(),
  };

  await updateDoc(docRef, {
    role: "dealer",
    dealerInfo: {
      ...currentDealerInfo,
      status: "approved",
      approvedAt: Date.now(),
    },
    updatedAt: Date.now(),
  });
};

/**
 * Admin action: Reject or demote dealer account to regular customer.
 */
export const rejectDealerAccount = async (uid: string): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.USERS, uid);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) throw new Error("Account not found");

  const current = docSnap.data() as UserProfile;
  await updateDoc(docRef, {
    role: "customer",
    "dealerInfo.status": "rejected",
    updatedAt: Date.now(),
  });
};

/**
 * Get all users who have applied for or have dealer status.
 */
export const getAllDealers = async (): Promise<UserProfile[]> => {
  const all = await getAllUsers();
  return all.filter(
    (u) =>
      u.role === "dealer" ||
      u.role === "dealer_pending" ||
      Boolean(u.dealerInfo)
  );
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
  try {
    const usersRef = collection(db, COLLECTIONS.USERS);
    const snapshot = await getDocs(usersRef);
    const users: UserProfile[] = [];
    snapshot.forEach((snap) => {
      users.push({ uid: snap.id, ...snap.data() } as UserProfile);
    });
    return users.sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
  } catch (error) {
    console.warn("Error fetching all users from Firestore:", error);
    return [];
  }
};

export const seedInitialAdminUser = async (
  adminEmail = "vedikadivine@gmail.com",
  adminName = "Vedika Admin"
): Promise<UserProfile> => {
  const adminId = "admin-master-user";
  const docRef = doc(db, COLLECTIONS.USERS, adminId);
  const adminProfile: UserProfile = {
    uid: adminId,
    email: adminEmail,
    displayName: adminName,
    role: "admin",
    addresses: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  await setDoc(docRef, adminProfile);
  return adminProfile;
};

export const updateUserProfileData = async (
  uid: string,
  data: { displayName?: string; phoneNumber?: string }
): Promise<UserProfile> => {
  const docRef = doc(db, COLLECTIONS.USERS, uid);
  const updates: Record<string, any> = {
    updatedAt: Date.now(),
  };

  if (data.displayName !== undefined) {
    updates.displayName = data.displayName;
    if (auth.currentUser && auth.currentUser.uid === uid) {
      try {
        await updateProfile(auth.currentUser, { displayName: data.displayName });
      } catch (e) {
        console.warn("Could not update auth displayName:", e);
      }
    }
  }

  if (data.phoneNumber !== undefined) {
    updates.phoneNumber = data.phoneNumber;
  }

  await setDoc(docRef, updates, { merge: true });
  const updatedDoc = await getDoc(docRef);
  return updatedDoc.data() as UserProfile;
};

export const saveUserAddress = async (uid: string, address: Address): Promise<Address[]> => {
  try {
    const docRef = doc(db, COLLECTIONS.USERS, uid);
    const profile = await getUserProfile(uid);
    let addresses = [...(profile?.addresses || [])];

    const addressId = address.id || `addr_${Date.now()}`;
    const newAddress: Address = { ...address, id: addressId };

    if (newAddress.isDefault || addresses.length === 0) {
      addresses = addresses.map((a) => ({ ...a, isDefault: false }));
      newAddress.isDefault = true;
    }

    const existingIdx = addresses.findIndex((a) => a.id === addressId);
    if (existingIdx >= 0) {
      addresses[existingIdx] = newAddress;
    } else {
      addresses.push(newAddress);
    }

    await setDoc(docRef, {
      addresses,
      updatedAt: Date.now(),
    }, { merge: true });
    return addresses;
  } catch (error) {
    console.warn("Could not save address to Firestore:", error);
    return [];
  }
};

export const deleteUserAddress = async (uid: string, addressId: string): Promise<Address[]> => {
  try {
    const docRef = doc(db, COLLECTIONS.USERS, uid);
    const profile = await getUserProfile(uid);
    let addresses = (profile?.addresses || []).filter((a) => a.id !== addressId);

    if (addresses.length > 0 && !addresses.some((a) => a.isDefault)) {
      addresses[0].isDefault = true;
    }

    await setDoc(docRef, {
      addresses,
      updatedAt: Date.now(),
    }, { merge: true });
    return addresses;
  } catch (error) {
    console.warn("Could not delete address from Firestore:", error);
    return [];
  }
};

export const setDefaultAddress = async (uid: string, addressId: string): Promise<Address[]> => {
  try {
    const docRef = doc(db, COLLECTIONS.USERS, uid);
    const profile = await getUserProfile(uid);
    const addresses = (profile?.addresses || []).map((a) => ({
      ...a,
      isDefault: a.id === addressId,
    }));

    await setDoc(docRef, {
      addresses,
      updatedAt: Date.now(),
    }, { merge: true });
    return addresses;
  } catch (error) {
    console.warn("Could not set default address in Firestore:", error);
    return [];
  }
};

export const subscribeToAuthChanges = (
  callback: (user: FirebaseUser | null) => void
) => {
  return onAuthStateChanged(auth, callback);
};
