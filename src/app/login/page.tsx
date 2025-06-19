"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "./login.module.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useRouter } from "next/navigation";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      setLoading(true);
      // Authenticate user with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in with email:", email);
      
      // Store authentication token in localStorage
      localStorage.setItem('authToken', await userCredential.user.getIdToken());
      localStorage.setItem('user', JSON.stringify({
        email: userCredential.user.email,
        uid: userCredential.user.uid
      }));
      
      // Redirect to dashboard or home page after successful login
      router.push("/");
    } catch (err: any) {
      console.error("Error during login:", err);
      setError(err.message || "Failed to login. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Navbar */}
      <div className={styles.floatingKey}></div>
  <div className={styles.floatingWallet}></div>
  <div className={styles.floatingCard}></div>
  <div className={styles.floatingPhone}></div>
  <div className={styles.floatingBag}></div>
  
      <nav className={styles.navbar}>
        <div className={styles.navbarContent}>
          <div className={styles.logo}>
            <Link href="/" className={styles.logoLink}>
              Lost and Found
            </Link>
          </div>
          <div className={styles.navLinks}>
            <Link href="/login" className={styles.loginLink}>
              Login
            </Link>
            <Link href="/signup" className={styles.signupLink}>
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <section className={styles.formSection}>
        <div className={styles.formContainer}>
          <h1 className={styles.formTitle}>
            <span className={styles.gradientText}>
              Login to Your Account
            </span>
          </h1>
          {error && <div className={styles.errorMessage}>{error}</div>} 
          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
                placeholder="you@example.com"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                required
                placeholder="••••••••"
              />
              <div className={styles.forgotPassword}>
                <Link href="/forgot-password" className={styles.forgotPasswordLink}>
                  Forgot password?
                </Link>
              </div>
            </div>
            
            <div className={styles.buttonContainer}>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>
          
          <div className={styles.signupPrompt}>
            Don't have an account?{" "}
            <Link href="/signup" className={styles.signupPromptLink}>
              Sign up
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>&copy; 2025 Lost & Found Website. All rights reserved.</p>
          <div className={styles.footerLinks}>
            <Link href="/terms" className={styles.footerLink}>Terms</Link>
            <Link href="/privacy-policy" className={styles.footerLink}>Privacy Policy</Link>
            <Link href="/contact" className={styles.footerLink}>Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}