import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import mockApi from '@/services/mockApi';
import logo from '@/assets/promart-logo.png';
import Lottie from 'lottie-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

const OTPVerify = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [animationData, setAnimationData] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetch('https://assets9.lottiefiles.com/packages/lf20_d2ia8oxc.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(() => console.log('Animation loading failed'));
  }, []);

  const formData = location.state;

  if (!formData) {
    navigate('/register');
    return null;
  }

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast({
        title: 'Invalid OTP',
        description: 'Please enter a 6-digit code',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      await mockApi.verifyOTP(formData.phone, otp);
      const user = await mockApi.register(formData);
      login(user);
      
      toast({
        title: 'Registration successful!',
        description: 'Welcome to ProMart',
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Verification failed',
        description: 'Invalid OTP code',
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
            <img src={logo} alt="ProMart" className="mx-auto h-16" />
          </Link>
          {animationData && (
            <div className="mx-auto mt-4 w-32">
              <Lottie animationData={animationData} loop={true} />
            </div>
          )}
        </div>

        <Card className="p-8">
          <h1 className="mb-2 text-2xl font-bold">Verify Your Phone</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Enter the 6-digit code sent to {formData.phone}
          </p>

          <div className="mb-6 flex justify-center">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button 
            onClick={handleVerify} 
            className="w-full" 
            disabled={loading || otp.length !== 6}
          >
            {loading ? 'Verifying...' : 'Verify & Complete Registration'}
          </Button>

          <div className="mt-4 text-center">
            <Button variant="ghost" size="sm" onClick={() => mockApi.sendOTP(formData.phone)}>
              Resend OTP
            </Button>
          </div>

          <div className="mt-6 rounded-lg bg-muted p-4 text-xs">
            <p className="font-semibold">Demo Mode:</p>
            <p>Enter any 6-digit code to proceed (e.g., 123456)</p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default OTPVerify;
