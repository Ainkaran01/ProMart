import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { User, Lock, Building2 } from "lucide-react";
import {
  updateProfile,
  changePassword,
  getProfile,
} from "@/services/settingsApi";

const Settings = () => {
  const { user, login, logout } = useAuth(); // Use login to update the user in context
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  const [profileData, setProfileData] = useState({
    email: "",
    phone: "",
    companyName: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Initialize profile data when user is available
  useEffect(() => {
    if (user) {
      setProfileData({
        email: user.email || "",
        phone: user.phone || "",
        companyName: user.companyName || "",
      });
      setProfileLoading(false);
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await updateProfile(profileData);
      toast({
        title: "Profile updated",
        description:
          res.message || "Your profile has been updated successfully",
      });

      // Get updated profile data
      const userData = await getProfile();

      // Update local state
      setProfileData({
        email: userData.email || "",
        phone: userData.phone || "",
        companyName: userData.companyName || "",
      });

      // Update AuthContext by calling login with updated data + existing token
      if (user) {
        const updatedUser = {
          ...user,
          email: userData.email || user.email,
          phone: userData.phone || user.phone,
          companyName: userData.companyName || user.companyName,
          token: user.token,
        };
        login(updatedUser);
      }
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toast({
        title: "Password updated",
        description:
          "Your password has been changed successfully. Please login again.",
      });

      // Force logout after password change
      setTimeout(() => {
        logout();
        window.location.assign("/login");
      }, 2000);

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading while user data is being fetched
  if (!user || profileLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-muted-foreground">Loading settings...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    required
                    disabled
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={profileData.companyName}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        companyName: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <Button type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update Profile"}
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
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
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
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
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
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                    placeholder="••••••••"
                  />
                </div>

                <Button type="submit" disabled={loading} variant="default">
                  {loading ? "Updating..." : "Change Password"}
                </Button>
              </form>
            </Card>

            {user?.role === "company" && (
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
                      <p className="text-sm font-medium text-muted-foreground">
                        Company Name
                      </p>
                      <p className="text-base font-semibold">
                        {user.companyName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Account Type
                      </p>
                      <p className="text-base font-semibold capitalize">
                        {user.role}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Member Since
                      </p>
                      <p className="text-base font-semibold">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
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
