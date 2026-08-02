
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShieldCheck, Mail, KeyRound, User, AtSign, Phone, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export default function MyInfoForm() {
  const { toast } = useToast();
  // Mock user data
  const [user, setUser] = useState({
    fullName: 'Ram Singh',
    username: 'ram_s',
    phone: '+91 9876543210',
    phoneVerified: true,
    email: '',
    emailVerified: false,
  });

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ variant: 'destructive', title: 'Error', description: "New passwords do not match." });
      return;
    }
    if (newPassword.length < 8) {
      toast({ variant: 'destructive', title: 'Error', description: "Password must be at least 8 characters long." });
      return;
    }
    // In a real app, you'd call an API here.
    console.log({ oldPassword, newPassword });
    toast({ title: 'Success', description: 'Your password has been changed.' });
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };
  
  const handleForgotPassword = () => {
    // In a real app, you'd trigger an OTP flow here.
    toast({ title: 'OTP Sent', description: `An OTP has been sent to ${user.phone}.` });
  }

  const handleEmailVerification = () => {
    if (!user.email) {
      toast({ variant: 'destructive', title: 'Error', description: "Please enter an email address first."});
      return;
    }
    // In a real app, you'd trigger an email verification flow.
    toast({ title: 'Verification Email Sent', description: `A verification link has been sent to ${user.email}.` });
  }

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle>My Information</CardTitle>
        <CardDescription>Manage your personal details and account security.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Personal Details */}
        <div className="space-y-4">
            <h3 className="font-medium">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="fullName" className="flex items-center gap-2"><User /> Full Name</Label>
                    <Input id="fullName" value={user.fullName} disabled />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="username" className="flex items-center gap-2"><AtSign /> Username</Label>
                    <Input id="username" value={user.username} disabled />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2"><Phone /> Phone Number</Label>
                    <div className="flex items-center gap-2">
                        <Input id="phone" value={user.phone} disabled />
                         {user.phoneVerified && <Badge className="bg-green-100 text-green-800 gap-1"><ShieldCheck className="h-3 w-3" /> Verified</Badge>}
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2"><Mail /> Email Address (Optional)</Label>
                    <div className="flex items-center gap-2">
                        <Input id="email" type="email" placeholder="you@example.com" value={user.email} onChange={(e) => setUser({...user, email: e.target.value, emailVerified: false})} />
                        {user.email && (
                            user.emailVerified ? (
                                <Badge className="bg-green-100 text-green-800 gap-1"><ShieldCheck className="h-3 w-3" /> Verified</Badge>
                            ) : (
                                <Button variant="outline" size="sm" onClick={handleEmailVerification}>Verify</Button>
                            )
                        )}
                    </div>
                     {!user.emailVerified && user.email && (
                        <p className="text-xs text-yellow-600 flex items-center gap-1"><AlertTriangle className="h-4 w-4" />Email not verified. Click verify to send a confirmation link.</p>
                     )}
                </div>
            </div>
        </div>

        <Separator />

        {/* Security Settings */}
        <div className="space-y-4">
            <h3 className="font-medium">Account Security</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="oldPassword">Current Password</Label>
                        <Input id="oldPassword" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>
                </div>
                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button type="button" variant="link" className="p-0 h-auto">Forgot Password?</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Forgot Your Password?</AlertDialogTitle>
                          <AlertDialogDescription>
                            We will send a one-time password (OTP) to your verified phone number ({user.phone}) to reset your password.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleForgotPassword}>Send OTP</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Button type="submit">
                        <KeyRound className="mr-2"/>
                        Change Password
                    </Button>
                </div>
            </form>
        </div>
      </CardContent>
    </Card>

    </>
  );
}
