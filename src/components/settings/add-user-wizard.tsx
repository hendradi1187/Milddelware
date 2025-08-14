'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, User, Shield, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { UserRole } from '@/app/settings/user-management/page';

const steps = [
  { id: '01', name: 'User Info', icon: User },
  { id: '02', name: 'Assign Role', icon: Shield },
  { id: '03', name: 'Review', icon: Check },
];

const initialData: { name: string; email: string; role: UserRole | '' } = {
    name: '',
    email: '',
    role: '',
};

export function AddUserWizard({ onSave }: { onSave: (data: Omit<any, 'id' | 'lastLogin'>) => void }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [formData, setFormData] = React.useState(initialData);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: UserRole) => {
    setFormData(prev => ({ ...prev, role: value }));
  };
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(step => step + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(step => step - 1);
    }
  };

  const handleSave = () => {
      onSave(formData as { name: string; email: string; role: UserRole });
      setIsOpen(false);
      setTimeout(() => {
          setCurrentStep(0);
          setFormData(initialData);
      }, 500);
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g., John Doe" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="e.g., john.doe@example.com" required />
            </div>
          </div>
        );
      case 1:
        return (
           <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">User Role</Label>
                <Select name="role" required onValueChange={handleRoleChange} value={formData.role || undefined}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin (Full Access)</SelectItem>
                    <SelectItem value="Technician">Technician (Device & Log Management)</SelectItem>
                    <SelectItem value="QA">QA (Quality Control & Results)</SelectItem>
                  </SelectContent>
                </Select>
                 <p className="text-xs text-muted-foreground px-1">The role determines the user's permissions across the application.</p>
            </div>
          </div>
        );
      case 2:
        return (
            <div className="space-y-4 text-sm">
                <h4 className="font-semibold text-lg">Review New User</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 p-4 border rounded-md">
                    <p className="text-muted-foreground">Full Name</p><p className="text-right">{formData.name}</p>
                    <p className="text-muted-foreground">Email</p><p className="text-right">{formData.email}</p>
                    <p className="text-muted-foreground">Role</p><p className="text-right font-semibold">{formData.role}</p>
                </div>
                <p className="text-muted-foreground text-xs text-center">An invitation will be sent to the user's email to set up their password.</p>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button><PlusCircle className="mr-2 h-4 w-4" /> Add User</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>Follow the steps to create a new user account and assign permissions.</DialogDescription>
        </DialogHeader>

        {/* Stepper */}
        <nav aria-label="Progress">
          <ol role="list" className="flex items-center">
            {steps.map((step, stepIdx) => (
              <li key={step.name} className={cn('relative flex-1', stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : '')}>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className={cn("h-0.5 w-full", currentStep > stepIdx ? "bg-primary" : "bg-border")}></div>
                </div>
                <div
                  className="relative flex h-8 w-8 items-center justify-center rounded-full"
                >
                    <motion.div
                        initial={false}
                        animate={currentStep > stepIdx ? "completed" : currentStep === stepIdx ? "active" : "inactive"}
                        variants={{
                            active: { scale: 1.25, backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' },
                            completed: { scale: 1, backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))'},
                            inactive: { scale: 1, backgroundColor: 'hsl(var(--border))', color: 'hsl(var(--muted-foreground))' },
                        }}
                        transition={{ duration: 0.3 }}
                        className="h-8 w-8 rounded-full flex items-center justify-center"
                    >
                     {currentStep > stepIdx ? <Check className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
                    </motion.div>
                </div>
                <p className={cn("absolute -bottom-6 text-xs w-max", 
                    currentStep === stepIdx ? "font-semibold text-primary" : "text-muted-foreground"
                )}>{step.name}</p>
              </li>
            ))}
          </ol>
        </nav>

        <div className="pt-10 min-h-[200px] flex flex-col justify-center">
             <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                >
                    {renderStepContent()}
                </motion.div>
            </AnimatePresence>
        </div>
        
        <DialogFooter>
           <div className="flex justify-between w-full">
                <Button variant="outline" onClick={handlePrev} disabled={currentStep === 0}>
                    Previous
                </Button>

                {currentStep < steps.length - 1 ? (
                    <Button onClick={handleNext}>Next Step</Button>
                ) : (
                    <Button onClick={handleSave}>Create User</Button>
                )}
           </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
