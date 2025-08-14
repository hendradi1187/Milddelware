
'use client';
import * as React from 'react';
import { MainLayout } from '@/components/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { Camera, Save, Info, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { updateProfile } from 'firebase/auth';
import { auth, storage } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (user) {
        setName(user.displayName || '');
        setEmail(user.email || '');
        setAvatarPreview(user.photoURL);
    }
  }, [user]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSaveChanges = async () => {
    if (!user || !auth.currentUser) return;
    setIsSaving(true);
    
    try {
        let photoURL = user.photoURL;

        if (avatarFile) {
            const storageRef = ref(storage, `profile-pictures/${user.uid}`);
            const snapshot = await uploadBytes(storageRef, avatarFile);
            photoURL = await getDownloadURL(snapshot.ref);
        }

        await updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: photoURL,
        });

        toast({
            title: 'Profile Updated',
            description: 'Your changes have been successfully saved.',
        });
    } catch (error) {
        console.error("Error updating profile: ", error);
        toast({
            variant: "destructive",
            title: 'Update Failed',
            description: 'There was an error saving your profile. Please try again.',
        });
    } finally {
        setIsSaving(false);
        setAvatarFile(null); // Reset file input after saving
    }
  };
  
  if (!user) {
    return (
        <MainLayout>
            <p>Loading...</p>
        </MainLayout>
    )
  }

  return (
    <MainLayout>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
            <Link href="/settings" className="hover:text-primary transition-colors">Settings</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-foreground">My Profile</span>
        </div>
      
        <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-1">
                <Card>
                    <CardHeader className="items-center text-center">
                        <div className="relative group">
                            <Avatar className="h-28 w-28 border-4 border-background shadow-md">
                                <AvatarImage src={avatarPreview || ''} alt="User Avatar" />
                                <AvatarFallback className="text-4xl">
                                    {name ? name.charAt(0).toUpperCase() : ''}
                                </AvatarFallback>
                            </Avatar>
                            <Button
                                variant="outline"
                                size="icon"
                                className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                                onClick={handleAvatarClick}
                             >
                                <Camera className="h-4 w-4" />
                                <span className="sr-only">Change photo</span>
                            </Button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/png, image/jpeg"
                            />
                        </div>
                        <CardTitle className="mt-4 text-2xl">{name}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Alert>
                            <Info className="h-4 w-4" />
                            <AlertTitle>Image Upload Enabled</AlertTitle>
                            <AlertDescription>
                                You can now upload a new profile picture. It will be saved to Firebase Storage.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-2">
                 <Card>
                    <CardHeader>
                        <CardTitle>Account Details</CardTitle>
                        <CardDescription>Update your personal information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" value={email} disabled />
                             <p className="text-xs text-muted-foreground px-1">Email address cannot be changed.</p>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Input id="role" value="Administrator" disabled />
                        </div>
                         <Button className="mt-4" onClick={handleSaveChanges} disabled={isSaving}>
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4"/>}
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>

    </MainLayout>
  );
}
