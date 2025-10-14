import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { verifyOTP, registerUser, sendOTP } from "@/services/api";
import logo from "@/assets/promart-logo.png";
import Lottie from "lottie-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const OTPVerify = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [animationData, setAnimationData] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetch("https://assets9.lottiefiles.com/packages/lf20_d2ia8oxc.json")
      .then((response) => response.json())
      .then((data) => setAnimationData(data))
      .catch(() => console.log("Animation loading failed"));
  }, []);

  const formData = location.state;
  console.log(formData);
  if (!formData) {
    navigate("/register");
    return null;
  }

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit code",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // ✅ Verify OTP via backend
      await verifyOTP(formData.email, otp);

      // ✅ Register user after successful OTP verification
      const user = await registerUser(formData);

      login(user);
      toast({
        title: "Registration successful!",
        description: "Welcome to ProMart",
      });

      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Verification failed",
        description: error.response?.data?.message || "Invalid OTP code",
        variant: "destructive",
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
          <h1 className="mb-2 text-2xl font-bold">Verify Your Email</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Enter the 6-digit code sent to {formData.email}
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
            {loading ? "Verifying..." : "Verify & Complete Registration"}
          </Button>

          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                try {
                  await sendOTP(formData.email);
                  toast({
                    title: "OTP resent",
                    description: "Check your email inbox again.",
                  });
                } catch {
                  toast({
                    title: "Failed to resend OTP",
                    variant: "destructive",
                  });
                }
              }}
            >
              Resend OTP
            </Button>
          </div>


        </Card>
      </motion.div>
    </div>
  );
};

export default OTPVerify;
