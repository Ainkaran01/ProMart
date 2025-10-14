import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { User, Lock, Building2 } from 'lucide-react';


const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    email: user?.email || '',
    phone: user?.phone || '',
    companyName: user?.companyName || '',

    
  });
console.log(user?.phone);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully',
      });
      setLoading(false);
    }, 1000);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please make sure your passwords match',
        variant: 'destructive',
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 8 characters',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Password updated',
        description: 'Your password has been changed successfully',
      });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
 
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-3xl"
        >
          <h1 className="mb-2 text-3xl font-bold">Settings</h1>
          <p className="mb-8 text-muted-foreground">
            Manage your account settings and preferences
          </p>

          <div className="space-y-6">
            {/* Profile Information */}
            <Card className="p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Profile Information</h2>
                  <p className="text-sm text-muted-foreground">
                    Update your account details
                  </p>
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    required
                  />
                  
                </div>

                {user?.role === 'company' && (
                  <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={profileData.companyName}
                      onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
                      required
                    />
                  </div>
                )}

                <Button type="submit" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Profile'}
                </Button>
              </form>
            </Card>

            <Separator />

            {/* Password Reset */}
            <Card className="p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Change Password</h2>
                  <p className="text-sm text-muted-foreground">
                    Update your password to keep your account secure
                  </p>
                </div>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                    placeholder="••••••••"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Must be at least 8 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                    placeholder="••••••••"
                  />
                </div>

                <Button type="submit" disabled={loading} variant="default">
                  {loading ? 'Updating...' : 'Change Password'}
                </Button>
              </form>
            </Card>

            {user?.role === 'company' && (
              <>
                <Separator />
                
                {/* Company Information */}
                <Card className="p-6">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">Company Details</h2>
                      <p className="text-sm text-muted-foreground">
                        Your company information
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 rounded-lg bg-muted p-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Company Name</p>
                      <p className="text-base font-semibold">{user.companyName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Account Type</p>
                      <p className="text-base font-semibold capitalize">{user.role}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                      <p className="text-base font-semibold">January 2024</p>
                    </div>
                  </div>
                </Card>
              </>
            )}
          </div>
        </motion.div>
      </div>

      
    </div>
  );
};

export default Settings;
