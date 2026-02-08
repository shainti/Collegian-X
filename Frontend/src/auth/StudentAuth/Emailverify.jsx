import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const EmailVerification = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [resending, setResending] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from location state or localStorage
  const userEmail = location.state?.email || localStorage.getItem('userEmail') || 'your@email.com';

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Format time
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle input change
  const handleChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = [...code];
    pastedData.split('').forEach((char, i) => {
      if (i < 6) newCode[i] = char;
    });
    setCode(newCode);
    
    // Focus last filled input or last input
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex].focus();
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      setError('Please enter all 6 digits');
      inputRefs.current[0].focus();
      return;
    }

    if (timeLeft <= 0) {
      setError('Verification code has expired. Please request a new one.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/Student/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          verificationCode: verificationCode
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Success - redirect to login
        localStorage.removeItem('userEmail');
        navigate('/Student/login', { 
          state: { 
            verified: true, 
            message: 'Email verified successfully! You can now login.' 
          } 
        });
      } else {
        setError(data.errors?.[0] || 'Invalid verification code');
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0].focus();
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Resend verification code
  const handleResend = async () => {
    setResending(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('http://localhost:3000/api/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail })
      });

      if (response.ok) {
        setTimeLeft(600); // Reset timer
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0].focus();
        setSuccessMessage('Verification code resent! Check your email.');
        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        const data = await response.json();
        setError(data.errors?.[0] || 'Failed to resend code');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Resend error:', error);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#050B16] flex items-center justify-center px-4 py-8">
      {/* BLUE GLOW BACKGROUND - Static, no animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* FLOATING ICONS - Removed all animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-[10%] left-[5%] text-3xl md:text-4xl">📧</div>
        <div className="absolute top-[15%] right-[10%] text-4xl md:text-5xl">✉️</div>
        <div className="absolute bottom-[25%] left-[8%] text-3xl md:text-4xl">📬</div>
        <div className="absolute top-[45%] right-[8%] text-2xl md:text-3xl">🔐</div>
        <div className="absolute bottom-[15%] right-[30%] text-3xl md:text-4xl">✅</div>
        <div className="absolute top-[30%] left-[20%] text-2xl md:text-3xl">⚡</div>
        <div className="absolute bottom-[30%] right-[20%] text-2xl md:text-3xl">🔑</div>
        <div className="absolute top-[20%] right-[30%] text-3xl md:text-4xl">📱</div>
        <div className="absolute bottom-[45%] left-[30%] text-2xl md:text-3xl">🎯</div>
      </div>

      {/* MAIN CONTAINER - CENTERED AND RESPONSIVE */}
      <div className="relative z-10 w-full max-w-md mx-auto mt-15">
        
        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 rounded-xl border border-green-400/40 bg-green-500/10 px-4 py-3 text-sm text-green-300 shadow-[0_0_25px_rgba(34,197,94,0.25)] backdrop-blur-md">
            <div className="flex items-center gap-2">
              <CheckCircle size={18} className="text-green-400 flex-shrink-0" />
              <span className="font-medium">{successMessage}</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-300 shadow-[0_0_25px_rgba(248,113,113,0.25)] backdrop-blur-md">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Verification Card */}
        <div className="bg-[#0a1122]/60 backdrop-blur-xl border border-blue-400/30 rounded-2xl p-5 sm:p-6 md:p-8 text-white shadow-[0_0_45px_rgba(56,189,248,0.2)] w-full">
          
          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-cyan-500 to-blue-700 rounded-full flex items-center justify-center mb-4 shadow-[0_0_25px_rgba(6,182,212,0.4)]">
              <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-cyan-200 mb-2 text-center">
              Verify Your Email
            </h1>
            <p className="text-cyan-100/70 text-xs sm:text-sm text-center">
              We've sent a 6-digit code to
            </p>
            <p className="text-white font-semibold mt-1 text-xs sm:text-sm text-center break-all px-2">
              {userEmail}
            </p>
          </div>
          
          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Code Input Fields */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-cyan-200 mb-3 text-center">
                Enter Verification Code
              </label>
              <div className="flex gap-1 sm:gap-2 justify-center flex-wrap">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 text-center text-xl sm:text-2xl font-bold bg-[#050B16]/60 border-2 border-blue-400/40 text-white rounded-lg focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 outline-none transition-all disabled:opacity-50"
                    inputMode="numeric"
                    pattern="[0-9]"
                    autoComplete="off"
                    disabled={loading}
                  />
                ))}
              </div>
            </div>
            
            {/* Timer */}
            <div className={`${timeLeft <= 0 ? 'bg-red-500/10 border-red-400/40' : 'bg-amber-500/10 border-amber-400/40'} border-l-4 p-3 sm:p-4 rounded-lg backdrop-blur-sm`}>
              <div className="flex items-center gap-2">
                <Clock className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${timeLeft <= 0 ? 'text-red-400' : 'text-amber-400'}`} />
                <p className={`text-xs sm:text-sm ${timeLeft <= 0 ? 'text-red-300' : 'text-amber-300'}`}>
                  {timeLeft <= 0 ? (
                    'Code expired. Please request a new one.'
                  ) : (
                    <>
                      Code expires in <span className="font-bold text-white">{formatTime(timeLeft)}</span>
                    </>
                  )}
                </p>
              </div>
            </div>
            
            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading || timeLeft <= 0}
              className={`w-full py-3 sm:py-3.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm sm:text-base font-semibold shadow-lg hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 ${
                (loading || timeLeft <= 0) ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Verify Email</span>
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                </>
              )}
            </button>
            
            {/* Resend Link */}
            <div className="text-center">
              <p className="text-xs sm:text-sm text-white/60">
                Didn't receive the code?{' '}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold hover:underline disabled:opacity-50 transition-colors duration-200"
                >
                  {resending ? 'Sending...' : 'Resend Code'}
                </button>
              </p>
            </div>
            
          </form>
          
        </div>
        
        {/* Help Text */}
        <p className="text-center text-xs sm:text-sm text-white/40 mt-4 sm:mt-6">
          Need help? <a href="/support" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors duration-200">Contact Support</a>
        </p>
        
      </div>
    </div>
  );
};

export default EmailVerification;