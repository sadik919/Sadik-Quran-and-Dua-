import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LogIn, KeyRound, Mail, User, ShieldAlert, LogOut, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function AuthSection() {
  const { currentUser, logout, isAdmin, setCurrentUser } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [testStatus, setTestStatus] = useState<string>("");
  const [testLoading, setTestLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    if (!auth) {
      setErrorMsg("Firebase Auth is not initialized. Please configure Firebase.");
      setIsLoading(false);
      return;
    }

    if (!forgotPasswordEmail.trim()) {
      setErrorMsg("Please enter your registered email address.");
      setIsLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, forgotPasswordEmail.trim().toLowerCase());
      setSuccessMsg("A password reset link has been sent to your email. Please check your inbox and spam folder.");
    } catch (err: any) {
      const errCode = err.code || "";
      if (errCode === 'auth/invalid-email') {
        setErrorMsg("Please enter a valid email address.");
      } else if (errCode === 'auth/user-not-found') {
        setErrorMsg("No account found with this email address.");
      } else {
        setErrorMsg(err.message || "Failed to send password reset email. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoAdminLogin = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);
    setIsSignUp(false);

    if (!auth) {
      setErrorMsg("Firebase Auth is not initialized. Please configure Firebase.");
      setIsLoading(false);
      return;
    }

    const adminEmail = 'sadikullhaque999@gmail.com';
    const adminPass = 'sadikull123';
    
    setEmail(adminEmail);
    setPassword(adminPass);

    try {
      try {
        await signInWithEmailAndPassword(auth, adminEmail, adminPass);
        setSuccessMsg("Admin logged in successfully!");
      } catch (signInErr: any) {
        const errCode = signInErr.code || "";
        const errMsg = signInErr.message || "";
        
        if (
          errCode === 'auth/user-not-found' || 
          errCode === 'auth/invalid-credential' ||
          errMsg.includes('user-not-found') ||
          errMsg.includes('invalid-credential') ||
          errMsg.includes('INVALID_LOGIN_CREDENTIALS')
        ) {
          console.log("Admin account does not exist or has incorrect credentials, attempting auto-registration...");
          const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPass);
          const user = userCredential.user;
          if (user) {
            await sendEmailVerification(user);
          }
          setSuccessMsg("Admin account registered and logged in successfully! A verification email has been sent.");
        } else {
          throw signInErr;
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An authentication error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    if (!auth) {
      setErrorMsg("Firebase Auth is not initialized. Please configure Firebase.");
      setIsLoading(false);
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    try {
      if (isSignUp) {
        // Sign Up with real Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
        const user = userCredential.user;
        if (user) {
          await sendEmailVerification(user);
        }
        if (auth.currentUser) {
          await auth.signOut();
        }
        setIsSignUp(false);
        setSuccessMsg("Your account has been created successfully. Please verify your email before logging in.");
      } else {
        // Log In with real Firebase Authentication
        try {
          await signInWithEmailAndPassword(auth, normalizedEmail, password);
          setSuccessMsg("Logged in successfully!");
        } catch (signInErr: any) {
          const errCode = signInErr.code || "";
          const errMsg = signInErr.message || "";
          
          const isAdminCred = (
            (normalizedEmail === 'sadikullhaque999@gmail.com' && password === 'sadikull123') ||
            (normalizedEmail === 'sadikullhaque99@gmail.com' && password === 'sadikull123')
          );

          if (
            isAdminCred && (
              errCode === 'auth/user-not-found' || 
              errCode === 'auth/invalid-credential' ||
              errMsg.includes('user-not-found') ||
              errMsg.includes('invalid-credential') ||
              errMsg.includes('INVALID_LOGIN_CREDENTIALS')
            )
          ) {
            console.log("Admin account does not exist or has incorrect credentials in Firebase, attempting seamless auto-registration...");
            try {
              const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
              const user = userCredential.user;
              if (user) {
                // Admin doesn't strictly need email verification if they are the admin, but we can send it anyway.
                // Wait, if firestore rules require isVerified() for write, we should probably bypass it or just send verification?
                // Actually firestore rules require isVerified() for write, which means request.auth.token.email_verified == true.
                // It is better to just let it register, they can verify it.
                await sendEmailVerification(user);
              }
              setSuccessMsg("Admin account registered and logged in successfully! A verification email has been sent. Please verify your email.");
            } catch (signUpErr: any) {
              const signUpCode = signUpErr.code || "";
              const signUpMsg = signUpErr.message || "";
              if (signUpCode === 'auth/email-already-in-use' || signUpMsg.includes('email-already-in-use')) {
                const customErr = new Error("Invalid email or password. Please check your credentials and try again.");
                (customErr as any).code = 'auth/wrong-password';
                throw customErr;
              } else {
                throw signUpErr;
              }
            }
          } else {
            throw signInErr;
          }
        }
      }
    } catch (err: any) {
      const errCode = err.code || "";
      const errMsg = err.message || "";
      
      // Map standard Firebase Auth Errors
      if (errCode === 'auth/email-already-in-use' || errMsg.includes('email-already-in-use')) {
        setErrorMsg("This email address is already registered.");
      } else if (errCode === 'auth/weak-password' || errMsg.includes('weak-password')) {
        setErrorMsg("Password is too weak. Must be at least 6 characters.");
      } else if (errCode === 'auth/invalid-email' || errMsg.includes('invalid-email')) {
        setErrorMsg("Please enter a valid email address.");
      } else if (errCode === 'auth/user-not-found' || errMsg.includes('user-not-found')) {
        setErrorMsg("User not found. Please register first or check your email.");
      } else if (errCode === 'auth/wrong-password' || errCode === 'auth/invalid-credential' || errMsg.includes('wrong-password') || errMsg.includes('invalid-credential') || errMsg.includes('INVALID_LOGIN_CREDENTIALS')) {
        setErrorMsg("Invalid email or password. Please check your credentials and try again.");
      } else {
        setErrorMsg(err.message || "An authentication error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    if (currentUser && db && auth?.currentUser) {
      if (!currentUser.emailVerified) {
        setTestStatus("❌ Firestore Auto-Test Blocked: Email verification is required to perform database write/read tests.");
        setTestLoading(false);
        return;
      }
      const runFirestoreTest = async () => {
        setTestLoading(true);
        setTestStatus("Initializing Firestore Write/Read Test...");
        try {
          const uid = auth.currentUser.uid;
          if (!uid) {
            throw new Error("No authenticated user's UID found in Firebase Auth!");
          }

          const testSettingsDoc = doc(db, 'settings', 'global');
          
          if (!active) return;
          setTestStatus("Writing test configuration to settings/global...");
          const sampleSettings = {
            fontSize: 16,
            arabicFont: "Amiri",
            banglaFont: "Hind Siliguri",
            isDarkMode: true,
            language: "bn",
            reminderMinutes: 15,
            accessibilityMode: false,
            lastTestWrite: new Date().toISOString(),
            testByUid: uid
          };
          
          await setDoc(testSettingsDoc, sampleSettings);
          if (!active) return;
          setTestStatus("Write Successful! Verifying by reading back...");
          
          // Verify by reading
          const docSnap = await getDoc(testSettingsDoc);
          if (!active) return;
          if (docSnap.exists()) {
            setTestStatus("✅ Firestore read/write test to settings/global completed successfully!");
          } else {
            setTestStatus("❌ Read verification failed: Document does not exist after writing.");
          }
        } catch (err: any) {
          console.error("Firestore test error:", err);
          if (!active) return;
          setTestStatus(`❌ Firestore Test Failed: ${err.message || err.toString()}`);
        } finally {
          if (active) setTestLoading(false);
        }
      };
      runFirestoreTest();
    } else {
      setTestStatus("");
      setTestLoading(false);
    }
    return () => {
      active = false;
    };
  }, [currentUser]);

  return (
    <div id="auth-section" className="space-y-6 max-w-sm mx-auto">
      {currentUser ? (
        /* Authenticated Status Screen */
        <motion.div
          key="auth-success"
          className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 shadow-sm text-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="font-bold text-slate-850 dark:text-white text-lg">Logged In</h3>
            <p className="text-xs text-slate-450 dark:text-slate-500 mt-1">{currentUser.email}</p>
            {isAdmin && (
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 dark:bg-amber-950 dark:text-amber-400 px-3 py-1 rounded-full uppercase mt-2 inline-block">
                Admin Privilege
              </span>
            )}
          </div>

          {/* Email Verification Required Banner */}
          {!currentUser.emailVerified && (
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-300 p-4 rounded-2xl text-left space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wide">
                <Mail className="w-4 h-4" /> Email Verification Required
              </div>
              <p className="text-[11px] text-slate-650 dark:text-slate-350 leading-relaxed font-medium">
                We've sent a verification link to your email address. Please click the verification link in your inbox (or spam) to verify your account, then click the button below to refresh.
              </p>
              
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      if (auth?.currentUser) {
                        await auth.currentUser.reload();
                        const verified = auth.currentUser.emailVerified;
                        setCurrentUser({
                          ...currentUser,
                          emailVerified: verified
                        });
                        if (verified) {
                          setSuccessMsg("Success! Your email address has been verified.");
                        } else {
                          setErrorMsg("Your email is still unverified. Please check your inbox and verify it first.");
                        }
                      }
                    } catch (e: any) {
                      setErrorMsg(e.message || "Failed to reload user state.");
                    }
                  }}
                  className="py-1.5 px-3 bg-emerald-800 hover:bg-emerald-750 text-white font-bold rounded-xl text-[10px] cursor-pointer text-center transition-colors shadow-sm"
                >
                  I've Verified
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      if (auth?.currentUser) {
                        await sendEmailVerification(auth.currentUser);
                        setSuccessMsg("Verification email resent successfully! Check your spam folder if you cannot find it.");
                      }
                    } catch (e: any) {
                      setErrorMsg(e.message || "Failed to resend verification email.");
                    }
                  }}
                  className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-650 text-slate-800 dark:text-white font-bold rounded-xl text-[10px] cursor-pointer text-center transition-colors"
                >
                  Resend Link
                </button>
              </div>
            </div>
          )}

          {/* Automatically run Firestore read/write test */}
          <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-left space-y-2">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-350 flex items-center gap-1.5 uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${testLoading ? "bg-amber-400" : testStatus.includes("✅") ? "bg-emerald-400" : "bg-red-400"}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${testLoading ? "bg-amber-500" : testStatus.includes("✅") ? "bg-emerald-500" : "bg-red-500"}`}></span>
              </span>
              Firestore Auto-Test
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono leading-relaxed break-words">
              {testStatus || "Waiting for authentication completion..."}
            </p>
          </div>

          <button
            onClick={logout}
            className="w-full py-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </motion.div>
      ) : isForgotPassword ? (
        /* Forgot Password Form */
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-serif font-bold text-slate-850 dark:text-white">
              Reset Password
            </h3>
            <p className="text-xs text-slate-450 dark:text-slate-500 mt-1">
              Enter your registered email address to receive a password reset link.
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200/50 text-red-800 dark:text-red-400 p-3 rounded-xl flex items-start gap-2 text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 text-emerald-850 dark:text-emerald-400 p-3 rounded-xl flex items-start gap-2 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleForgotPassword} className="space-y-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-white"
                  placeholder="ali@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-emerald-850 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => {
                setIsForgotPassword(false);
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-750 cursor-pointer"
            >
              Back to Log In
            </button>
          </div>
        </div>
      ) : (
        /* Authentication Forms */
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-serif font-bold text-slate-850 dark:text-white">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h3>
            <p className="text-xs text-slate-450 dark:text-slate-500 mt-1">
              {isSignUp ? "Sign up to track favorites and save history" : "Log in to sync your Islamic progress across devices"}
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200/50 text-red-800 dark:text-red-400 p-3 rounded-xl flex items-start gap-2 text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 text-emerald-850 dark:text-emerald-400 p-3 rounded-xl flex items-start gap-2 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
            {isSignUp && (
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-white"
                    placeholder="Muhammad Ali"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-white"
                  placeholder="ali@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Password</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-white"
                  placeholder="••••••••"
                />
              </div>
              {!isSignUp && (
                <div className="text-right mt-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(true);
                      setForgotPasswordEmail(email);
                      setErrorMsg("");
                      setSuccessMsg("");
                    }}
                    className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-emerald-850 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {isLoading ? "Authenticating..." : isSignUp ? "Sign Up" : "Log In"}
            </button>

            {!isSignUp && (
              <button
                type="button"
                onClick={handleAutoAdminLogin}
                disabled={isLoading}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-200 dark:border-slate-600 shadow-sm mt-3"
              >
                Auto Log In (Admin)
              </button>
            )}
          </form>

          {/* Form Toggle Link */}
          <div className="text-center pt-2">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-750 cursor-pointer"
            >
              {isSignUp ? "Already have an account? Log In" : "Don't have an account yet? Sign Up"}
            </button>
          </div>


        </div>
      )}
    </div>
  );
}
