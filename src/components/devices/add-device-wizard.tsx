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
import { Check, GitBranch, Info, Plug, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';

const steps = [
  { id: '01', name: 'Device Info', icon: Info },
  { id: '02', name: 'Connection', icon: Plug },
  { id: '03', name: 'Mapping', icon: GitBranch },
  { id: '04', name: 'Review', icon: Check },
];

const initialData = {
    id: '',
    name: '',
    model: '',
    serialNumber: '',
    firmwareVersion: '',
    connectionType: ''
};

export function AddDeviceWizard({ onSave }: { onSave: (data: typeof initialData) => void }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [formData, setFormData] = React.useState(initialData);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      onSave(formData);
      setIsOpen(false);
      // Reset state for next time
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
              <Label htmlFor="id">Device ID</Label>
              <Input id="id" name="id" value={formData.id} onChange={handleInputChange} placeholder="e.g., DEV-006" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Device Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g., Chemistry Analyzer" required />
            </div>
             <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input id="model" name="model" value={formData.model} onChange={handleInputChange} placeholder="e.g., Cobas C501" required />
            </div>
          </div>
        );
      case 1:
        return (
           <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="connectionType">Connection Type</Label>
              <Input id="connectionType" name="connectionType" value={formData.connectionType} onChange={handleInputChange} placeholder="e.g., TCP/IP Bi-directional" required />
            </div>
             <div className="space-y-2">
              <Label htmlFor="serialNumber">Serial Number</Label>
              <Input id="serialNumber" name="serialNumber" value={formData.serialNumber} onChange={handleInputChange} placeholder="e.g., SN-12345678" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="firmwareVersion">Firmware Version</Label>
              <Input id="firmwareVersion" name="firmwareVersion" value={formData.firmwareVersion} onChange={handleInputChange} placeholder="e.g., v2.1.3" required />
            </div>
          </div>
        );
      case 2:
        return <p className="text-muted-foreground text-center py-8">Data mapping configuration will be available here in a future update.</p>;
      case 3:
        return (
            <div className="space-y-4 text-sm">
                <h4 className="font-semibold text-lg">Review Device Information</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 p-4 border rounded-md">
                    <p className="text-muted-foreground">Device ID</p><p className="font-mono text-right">{formData.id}</p>
                    <p className="text-muted-foreground">Device Name</p><p className="text-right">{formData.name}</p>
                    <p className="text-muted-foreground">Model</p><p className="text-right">{formData.model}</p>
                    <Separator className="col-span-2 my-2"/>
                    <p className="text-muted-foreground">Connection</p><p className="text-right">{formData.connectionType}</p>
                    <p className="text-muted-foreground">Serial Number</p><p className="text-right">{formData.serialNumber}</p>
                    <p className="text-muted-foreground">Firmware</p><p className="text-right">{formData.firmwareVersion}</p>
                </div>
                <p className="text-muted-foreground text-xs text-center">Please verify all information is correct before saving the device.</p>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Device</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Device</DialogTitle>
          <DialogDescription>Follow the steps to configure a new lab instrument.</DialogDescription>
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

        <div className="pt-10 min-h-[250px] flex flex-col justify-center">
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
                    Previous Step
                </Button>

                {currentStep < steps.length - 1 ? (
                    <Button onClick={handleNext}>Next Step</Button>
                ) : (
                    <Button onClick={handleSave}>Finish & Save</Button>
                )}
           </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
