
'use client';
import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import Image from 'next/image';

const AppLogo = () => (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.25 15.75C2.25 14.2552 3.45517 13.05 4.95 13.05H15.75V4.95C15.75 3.45517 14.5448 2.25 13.05 2.25H4.95C3.45517 2.25 2.25 3.45517 2.25 4.95V15.75Z"
        fill="#3B82F6"
      />
      <path
        d="M13.05 33.75H4.95C3.45517 33.75 2.25 32.5448 2.25 31.05V20.25H13.05C14.5448 20.25 15.75 21.4552 15.75 22.95V31.05C15.75 32.5448 14.5448 33.75 13.05 33.75Z"
        fill="#3B82F6"
      />
      <path
        d="M22.95 15.75C21.4552 15.75 20.25 14.5448 20.25 13.05V4.95C20.25 3.45517 21.4552 2.25 22.95 2.25H31.05C32.5448 2.25 33.75 3.45517 33.75 4.95V13.05C33.75 14.5448 32.5448 15.75 31.05 15.75H22.95Z"
        fill="#A3BFFA"
      />
    </svg>
);


export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [email, setEmail] = React.useState('hdinata935@gmail.com');
  const [password, setPassword] = React.useState('password123');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        console.warn(`User document not found for UID: ${user.uid}. Defaulting to 'Admin' role. Please create the document in Firestore.`);
      }

      toast({ title: "Login Successful", description: "Redirecting to your dashboard." });
      router.push('/');

    } catch (error: any) {
      console.error("Login Error:", error);
      let description = "An unknown error occurred. Please try again.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        description = "Invalid email or password. Please double-check your credentials and try again.";
      } else if (error.code === 'unavailable' || error.code === 'auth/network-request-failed') {
         description = "Could not connect to Firebase. Please check your network connection and ensure you've created the user role document in Firestore as per the guide.";
      }

      toast({
        variant: "destructive",
        title: "Login Failed",
        description: description,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#121829] p-4 text-white">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex items-center gap-4">
           <AppLogo />
           <span className="text-2xl font-bold">Middleware LIS</span>
        </div>

        <div className="space-y-6">
            <h1 className="text-4xl font-bold">Login</h1>
            <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                <Input 
                    id="email" 
                    type="email" 
                    placeholder="Email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent border-gray-600 focus:border-primary focus:ring-primary"
                />
                </div>
                <div className="space-y-2">
                <Input 
                    id="password" 
                    type="password" 
                    placeholder="Password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-transparent border-gray-600 focus:border-primary focus:ring-primary"
                />
                </div>
                
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <Checkbox id="remember-me" className="border-gray-600 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                        <Label htmlFor="remember-me" className="font-normal text-gray-400">Remember me</Label>
                    </div>
                    <Link href="#" className="font-medium text-primary hover:underline">
                        Forgot password?
                    </Link>
                </div>

                <Button type="submit" className="w-full !mt-8 h-12 text-base" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Log in'}
                </Button>
            </form>
        </div>

        <div className="text-center text-sm">
            <p className="text-gray-400">
                Don't have an account?{' '}
                <Link href="#" className="font-medium text-primary hover:underline">
                    Register
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
}
