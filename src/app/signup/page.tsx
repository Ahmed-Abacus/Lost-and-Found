"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "./signup.module.css";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    try {
      setLoading(true);
      
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Store additional user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        createdAt: new Date().toISOString(),
      });
    // Here, you can add the signup logic like calling an API or saving user data
    console.log("User signed up successfully:", user.uid);
     // Redirect to login page or dashboard
     router.push("/login");
    } catch (err: any) {
      console.error("Error during signup:", err);
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Navbar */}
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

      {/* Signup Form */}
      <section className={styles.formSection}>
        <div className={styles.formContainer}>
          <h1 className={styles.formTitle}>
            <span className={styles.gradientText}>
              Create Account
            </span>
          </h1>
          {error && <div className={styles.errorMessage}>{error}</div>} 
          <form onSubmit={handleSignup} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.input}
                required
                placeholder="Enter your full name"
              />
            </div>
            
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
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.input}
                required
                placeholder="••••••••"
              />
            </div>
            
            <div className={styles.buttonContainer}>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>
          
          <div className={styles.loginPrompt}>
            Already have an account?{" "}
            <Link href="/login" className={styles.loginPromptLink}>
              Log in
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
            <Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link>
            <Link href="/contact" className={styles.footerLink}>Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}