import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, ArrowRight, Shield } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useUIStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';
import { Link } from 'react-router-dom';

type Step = 'phone' | 'otp';

export function LoginModal() {
  const { activeModal, closeModal, addToast } = useUIStore();
  const { login } = useAuthStore();
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isOpen = activeModal === 'login';

  useEffect(() => {
    if (!isOpen) {
      setStep('phone');
      setPhone('');
      setOtp(['', '', '', '', '', '']);
      setResendTimer(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setStep('otp');
    setResendTimer(30);
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.some((d) => !d)) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);

    login(phone);
    addToast('Successfully logged in!', 'success');
    closeModal();
  };

  const handleResend = () => {
    setResendTimer(30);
    addToast('OTP resent to your phone', 'info');
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="sm">
      <div className="p-6">
        {step === 'phone' ? (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
                <Phone className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Login to Zipto
                </h2>
                <p className="text-sm text-gray-500">
                  Enter your phone number to continue
                </p>
              </div>
            </div>

            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="flex gap-2">
                <div className="w-16 px-3 py-2.5 bg-gray-50 rounded-lg text-center font-medium text-gray-700 border border-gray-200">
                  +91
                </div>
                <Input
                  type="tel"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
                  }
                  maxLength={10}
                  className="flex-1"
                  autoFocus
                />
              </div>

              <Button
                type="submit"
                fullWidth
                size="lg"
                loading={loading}
                disabled={phone.length !== 10}
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>

            <p className="mt-4 text-xs text-gray-500 text-center">
              By continuing, you agree to our{' '}
              <Link
                to="/terms"
                onClick={closeModal}
                className="text-violet-600 hover:underline"
              >
                Terms
              </Link>{' '}
              and{' '}
              <Link
                to="/privacy"
                onClick={closeModal}
                className="text-violet-600 hover:underline"
              >
                Privacy Policy
              </Link>
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Verify OTP</h2>
                <p className="text-sm text-gray-500">
                  Sent to +91 {phone.slice(0, 5)} {phone.slice(5)}
                </p>
              </div>
            </div>

            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="flex gap-2 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-11 h-12 text-center text-lg font-bold border-2 border-gray-200 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                  />
                ))}
              </div>

              <Button
                type="submit"
                fullWidth
                size="lg"
                loading={loading}
                disabled={otp.some((d) => !d)}
              >
                Verify & Login
              </Button>
            </form>

            <div className="mt-4 text-center">
              {resendTimer > 0 ? (
                <p className="text-sm text-gray-500">
                  Resend OTP in {resendTimer}s
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  className="text-sm text-violet-600 hover:underline font-medium"
                >
                  Resend OTP
                </button>
              )}
            </div>

            <button
              onClick={() => setStep('phone')}
              className="mt-2 w-full text-sm text-gray-500 hover:text-gray-700"
            >
              Change phone number
            </button>
          </motion.div>
        )}
      </div>
    </Modal>
  );
}
