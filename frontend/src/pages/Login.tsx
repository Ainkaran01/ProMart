import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import mockApi from '@/services/mockApi';
import { useToast } from '@/hooks/use-toast';
import logo from '@/assets/promart-logo.png';
import Lottie from 'lottie-react';
import { useEffect, useState as useStateEffect } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [animationData, setAnimationData] = useStateEffect<any>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetch('https://assets2.lottiefiles.com/packages/lf20_puciaact.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(() => console.log('Animation loading failed'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await mockApi.login(email, password);
      login(user);
      toast({
        title: 'Welcome back!',
        description: 'Successfully logged in',
      });
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'Invalid credentials. Try: admin@promart.com or company@example.com',
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
          <h1 className="mb-6 text-2xl font-bold">Welcome Back</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@company.com"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Register
              </Link>
            </p>
          </div>

          <div className="mt-4 rounded-lg bg-muted p-4 text-xs">
            <p className="mb-2 font-semibold">Demo Credentials:</p>
            <p>Admin: admin@promart.com (any password)</p>
            <p>Company: company@example.com (any password)</p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
