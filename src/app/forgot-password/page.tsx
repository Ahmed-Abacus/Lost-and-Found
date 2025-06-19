"use client";

import { useState } from 'react';
import Link from 'next/link';
import styles from './forgot.module.css';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      // Send password reset email using Firebase
      await sendPasswordResetEmail(auth, email);
      
      // Show success message
      setMessage({
        type: 'success',
        text: 'Password reset instructions have been sent to your email.'
      });
      setEmail('');
      
      // Optional: Redirect to login page after a delay
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error: any) {
      console.error('Error sending password reset email:', error);
      
      // Handle specific Firebase error codes
      if (error.code === 'auth/user-not-found') {
        setMessage({
          type: 'error',
          text: 'No account found with this email address.'
        });
      } else if (error.code === 'auth/invalid-email') {
        setMessage({
          type: 'error',
          text: 'Please enter a valid email address.'
        });
      } else if (error.code === 'auth/too-many-requests') {
        setMessage({
          type: 'error',
          text: 'Too many attempts. Please try again later.'
        });
      } else {
        setMessage({
          type: 'error',
          text: 'An error occurred. Please try again later.'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Add floating elements to match other pages */}
      <div className={styles.floatingKey}></div>
      <div className={styles.floatingWallet}></div>
      <div className={styles.floatingCard}></div>
      
      <nav className={styles.navbar}>
        <div className={styles.navbarContent}>
          <div className={styles.logo}>
            <Link href="/" className={styles.logoLink}>
              Lost & Found
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

      <section className={styles.formSection}>
        <div className={styles.forgotPasswordContainer}>
          <h1 className={`${styles.forgotPasswordTitle} ${styles.gradientText}`}>
            Forgot Password
          </h1>
          
          <p className={styles.forgotPasswordDescription}>
            Enter your email address below and we'll send you instructions to reset your password.
          </p>

          {message.text && (
            <div className={message.type === 'success' ? styles.successMessage : styles.errorMessage}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className={styles.input}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.buttonContainer}>
              <button
                type="submit"
                className={styles.resetButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Reset Password'}
              </button>
            </div>
          </form>

          <Link href="/login" className={styles.backToLoginLink}>
            Back to Login
          </Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>© {new Date().getFullYear()} Lost & Found. All rights reserved.</p>
          <div className={styles.footerLinks}>
            <Link href="/terms" className={styles.footerLink}>
              Terms of Service
            </Link>
            <Link href="/privacy-policy" className={styles.footerLink}>
              Privacy Policy
            </Link>
            <Link href="/contact" className={styles.footerLink}>
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}