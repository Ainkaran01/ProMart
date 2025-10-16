import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types';
import { Search, UserCog, Mail, Phone, Building2, Shield, UserX } from 'lucide-react';
import adminApi from '@/services/adminService';


const UserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);


   useEffect(() => {
    const fetchuser = async () => {
      try {
        const data = await adminApi.getCompanies();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchuser();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
  );

  const handleDeactivateUser = (userId: string) => {
    setLoading(true);
    setTimeout(() => {
      toast({
        title: 'User deactivated',
        description: 'The user account has been deactivated',
      });
      setLoading(false);
      setSelectedUser(null);
    }, 1000);
  };

  const handleResetPassword = (userId: string) => {
    setLoading(true);
    setTimeout(() => {
      toast({
        title: 'Password reset email sent',
        description: 'The user will receive instructions to reset their password',
      });
      setLoading(false);
      setSelectedUser(null);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">User Management</h1>
              <p className="text-muted-foreground">Manage all users and companies</p>
            </div>
          </div>

          <Card className="mb-6 p-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <UserCog className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{users.length}</p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="rounded-full bg-success/10 p-3">
                  <Building2 className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {users.filter((u) => u.role === 'company').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Companies</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="rounded-full bg-warning/10 p-3">
                  <Shield className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {users.filter((u) => u.role === 'admin').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Admins</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by email, company, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        <div className="space-y-3">
          {filteredUsers.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No users found</p>
            </Card>
          ) : (
            filteredUsers.map((user, index) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 transition-all hover:shadow-md">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-3 flex items-center gap-3">
                        <h3 className="text-lg font-semibold">
                          {user.companyName || 'Admin User'}
                        </h3>
                        <Badge
                          variant={user.role === 'admin' ? 'default' : 'secondary'}
                        >
                          {user.role}
                        </Badge>
                      </div>

                      <div className="grid gap-2 text-sm md:grid-cols-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          {user.phone}
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedUser(user)}
                    >
                      View Details
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* User Details Modal */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              <div className="grid gap-4 rounded-lg bg-muted p-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="mb-1 text-sm font-medium text-muted-foreground">
                      User ID
                    </p>
                    <p className="font-mono text-sm">{selectedUser._id}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-medium text-muted-foreground">
                      Role
                    </p>
                    <Badge variant={selectedUser.role === 'admin' ? 'default' : 'secondary'}>
                      {selectedUser.role}
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="mb-1 text-sm font-medium text-muted-foreground">
                    Email Address
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {selectedUser.email}
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-sm font-medium text-muted-foreground">
                    Phone Number
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {selectedUser.phone}
                  </p>
                </div>

                {selectedUser.companyName && (
                  <div>
                    <p className="mb-1 text-sm font-medium text-muted-foreground">
                      Company Name
                    </p>
                    <p className="flex items-center gap-2 text-lg font-semibold">
                      <Building2 className="h-5 w-5 text-primary" />
                      {selectedUser.companyName}
                    </p>
                  </div>
                )}

                <div>
                  <p className="mb-1 text-sm font-medium text-muted-foreground">
                    Account Status
                  </p>
                  <Badge variant="outline" className="border-success text-success">
                    Active
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Admin Actions</h3>
                
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleResetPassword(selectedUser._id)}
                    disabled={loading}
                  >
                    Send Password Reset
                  </Button>

                  <Button
                    variant="outline"
                    className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => handleDeactivateUser(selectedUser._id)}
                    disabled={loading}
                  >
                    <UserX className="mr-2 h-4 w-4" />
                    Deactivate Account
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

 
    </div>
  );
};

export default UserManagement;
