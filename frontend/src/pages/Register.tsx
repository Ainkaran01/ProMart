import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import mockApi from '@/services/mockApi';
import logo from '@/assets/promart-logo.png';
import Lottie from 'lottie-react';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    companyName: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [animationData, setAnimationData] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetch('https://assets10.lottiefiles.com/packages/lf20_myejiggj.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(() => console.log('Animation loading failed'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First send OTP
      await mockApi.sendOTP(formData.phone);
      toast({
        title: 'OTP Sent',
        description: 'Check your phone for the verification code',
      });
      
      // Navigate to OTP verification with form data
      navigate('/verify-otp', { state: formData });
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 to-background p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block">
            <img src={logo} alt="ProMart" className="mx-auto h-40" />
          </Link>
          {animationData && (
            <div className="mx-auto mt-4 w-32">
              <Lottie animationData={animationData} loop={true} />
            </div>
          )}
        </div>

        <Card className="p-8">
          <h1 className="mb-6 text-2xl font-bold">Create Company Account</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                required
                placeholder="Your Company Ltd"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="contact@company.com"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                placeholder="+1234567890"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Continue to Verification'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </div>

          <div className="mt-4 rounded-lg bg-muted p-4 text-xs">
            <p className="font-semibold">Note:</p>
            <p>You'll receive an OTP for verification in the next step</p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
