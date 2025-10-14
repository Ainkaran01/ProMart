import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { sendOTP } from '@/services/api';
import logo from '@/assets/promart-logo.png';
import Lottie from 'lottie-react';
import { ArrowRight, Building2, Mail, Phone, Lock } from 'lucide-react';
import Navbar from '@/components/Navbar';

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
    await sendOTP(formData.email);
    toast({
      title: 'OTP Sent',
      description: 'Check your email for the verification code',
    });
    navigate('/verify-otp', { state: formData });
  } catch (error) {
    toast({
      title: 'Error',
      description: error.response?.data?.message || 'Failed to send OTP',
      variant: 'destructive',
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-background to-amber-50/20">
      {/* Header */}
      <Navbar />

      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-4">
        <div className="grid w-full max-w-6xl lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Desktop Animation - ON THE LEFT SIDE */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block order-1"
          >
            <div className="text-center">
              {animationData && (
                <div className="mx-auto w-full max-w-md">
                  <Lottie animationData={animationData} loop={true} />
                </div>
              )}
              <div className="mt-8 text-left">
                <h1 
                  className="mb-4 text-4xl font-bold text-slate-800"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Join ProMart Today
                </h1>
                <p className="text-lg text-slate-600 mb-6">
                  Create your company account and start connecting with verified construction and engineering professionals.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10">
                      <Building2 className="h-4 w-4 text-amber-500" />
                    </div>
                    <span className="text-slate-700">Showcase your business to qualified clients</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10">
                      <Mail className="h-4 w-4 text-amber-500" />
                    </div>
                    <span className="text-slate-700">Get verified and build trust</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10">
                      <Phone className="h-4 w-4 text-amber-500" />
                    </div>
                    <span className="text-slate-700">Secure OTP verification process</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form - ON THE RIGHT SIDE FOR DESKTOP */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full order-2 lg:order-2"
          >
            <Card className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-6 lg:p-8 shadow-lg">
              <div className="mb-6 lg:mb-8 text-center">
                <h1 className="mb-2 text-2xl lg:text-3xl font-bold text-slate-800">Create Company Account</h1>
                <p className="text-slate-600">Join the premier B2B marketplace</p>
              </div>

              {/* Mobile Animation - ONLY SHOWS ON MOBILE, ABOVE THE FORM */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:hidden mb-6"
              >
                <div className="text-center">
                  {animationData && (
                    <div className="mx-auto w-48 mb-4">
                      <Lottie animationData={animationData} loop={true} />
                    </div>
                  )}
                  <div>
                    <h2 
                      className="mb-2 text-xl font-bold text-slate-800"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      Join ProMart Today
                    </h2>
                    <p className="text-sm text-slate-600">
                      Create your company account and start connecting with verified professionals.
                    </p>
                  </div>
                </div>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-slate-800">Company Name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      required
                      placeholder="Your Company Ltd"
                      className="pl-10 border-slate-300 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-800">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="contact@company.com"
                      className="pl-10 border-slate-300 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-800">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      placeholder="+1234567890"
                      className="pl-10 border-slate-300 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-800">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      placeholder="••••••••"
                      className="pl-10 border-slate-300 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold shadow-lg hover:shadow-amber-500/40 transition-all duration-300 group"
                  disabled={loading}
                  size="lg"
                >
                  {loading ? (
                    'Sending OTP...'
                  ) : (
                    <>
                      Continue to Verification
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-slate-600">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="font-semibold text-amber-600 hover:text-amber-700 hover:underline transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;