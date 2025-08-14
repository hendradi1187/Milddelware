
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { FlaskConical } from 'lucide-react';

type UserRole = 'Admin' | 'Technician' | 'QA' | null;

interface AuthContextType {
  user: User | null;
  userRole: UserRole;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role as UserRole);
        } else {
           // Default to Admin if no specific role is found in Firestore
           setUserRole('Admin');
        }
        if (pathname === '/login') {
            router.push('/');
        }
      } else {
        setUser(null);
        setUserRole(null);
        if (pathname !== '/login') {
            router.push('/login');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, pathname]);
  
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserRole(null);
    router.push('/login');
  };

  if (loading && pathname !== '/login') {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <FlaskConical className="h-12 w-12 animate-pulse text-primary" />
                <p className="text-muted-foreground">Loading LabBridge Medfusion...</p>
            </div>
        </div>
    );
  }

  // Do not render children if we are on the login page and not authenticated
  if (!user && pathname !== '/login') {
      return null;
  }
    
  // Do not render children until loading is false, except for the login page itself
  if (loading && pathname === '/login') {
    return null;
  }

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
