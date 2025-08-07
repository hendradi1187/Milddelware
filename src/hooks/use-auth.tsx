'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

type UserRole = 'Admin' | 'Technician' | 'QA' | null;

interface AuthContextType {
  user: User | null;
  userRole: UserRole;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to create a mock user for simulation
const createMockUser = (): User => ({
  uid: 'mock-admin-uid',
  email: 'admin@medfusion.com',
  displayName: 'Admin (Simulated)',
  emailVerified: true,
  isAnonymous: false,
  metadata: {},
  providerData: [],
  providerId: 'password',
  tenantId: null,
  photoURL: null,
  // Add dummy implementations for methods
  delete: async () => {},
  getIdToken: async () => 'mock-token',
  getIdTokenResult: async () => ({
    token: 'mock-token',
    expirationTime: '',
    authTime: '',
    issuedAtTime: '',
    signInProvider: null,
    signInSecondFactor: null,
    claims: {},
  }),
  reload: async () => {},
  toJSON: () => ({}),
});


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        // In a real scenario, you might not have a firestore doc for a mock user.
        // Let's assume the role comes from Firestore if the user is real.
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role as UserRole);
        } else {
           // If no doc, and it's not the mock user, they have no role.
          setUserRole(null);
        }
      } else {
        // --- SIMULATION BYPASS ---
        // If Firebase auth fails or no user is logged in,
        // we create a mock Admin user for simulation purposes.
        console.warn("SIMULATION MODE: Bypassing login and mocking Admin user.");
        const mockUser = createMockUser();
        setUser(mockUser);
        setUserRole('Admin');
        // We no longer redirect to '/login'
        // router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);
  
  const logout = async () => {
    // In simulation mode, we just redirect. In a real scenario, we sign out.
    if (user && user.uid !== 'mock-admin-uid') {
        await signOut(auth);
    }
    // Clear state and redirect to login
    setUser(null);
    setUserRole(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, userRole, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
