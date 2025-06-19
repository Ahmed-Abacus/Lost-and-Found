"use client"
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Connections from '@/components/Connections';
import Footer from '@/components/Footer';


export default function Home() {
  const router = useRouter(); 
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
 
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const checkAuthentication = () => {
    // Check if user is logged in (using localStorage or cookies)
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token || user); 
  };
  
  const handleUserInteraction = () => {
    if (audioRef.current && !audioPlaying) {
      audioRef.current.volume = 0.7;
      audioRef.current.loop = true;
      audioRef.current.play()
        .then(() => {
          setAudioPlaying(true);
        })
        .catch(error => {
          console.log("Play failed:", error);
        });
    }
  };

  useEffect(() => {
    // Pl
    const authStatus = checkAuthentication();
    setIsAuthenticated(authStatus);
    if (!authStatus) {
      router.push('/login');
      return;
    }
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    if (audioRef.current) {
      // Set volume to a louder level
      audioRef.current.volume = 0.4;
      audioRef.current.loop = true;
      
      // Try to play the audio
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setAudioPlaying(true);
            
          
          })
          .catch(error => {
            console.log("Auto-play was prevented. User needs to interact with the page first.");
          });
      }
    }
    
    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    
    };
  }, [router]);

  const handlePlayAudio = () => {
    if (!isAuthenticated ) {
      router.push('/login');
      return;
    }
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => {
          setAudioPlaying(true);
        })
        .catch(error => {
          console.log("Play failed:", error);
        });
    }
  };

 

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f5e6d3] to-[#fff8dc] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pattern-grid"></div>
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#32230f] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animate-blob-primary"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-[#6c2704] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animate-blob-secondary animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[#98765432] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>
      <audio ref={audioRef} preload="auto">
        <source src="/sound.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {!audioPlaying && (
        <button 
          onClick={handlePlayAudio}
          className="fixed bottom-4 right-4 z-50 bg-[#32230f] text-white p-3 rounded-full shadow-lg"
          aria-label="Play background music"
        >
          🔊
        </button>
      )}
      {/* Falling Items Animation - Enhanced with more items and faster speeds */}
      <div className="falling-item falling-item-fast falling-item-far-left">
        <Image src="/icons/wallet.png" alt="Wallet" width={60} height={60} />
      </div>
      <div className="falling-item falling-item-medium falling-item-left">
        <Image src="/icons/credit-card.png" alt="card" width={60} height={60} />
      </div>
      <div className="falling-item falling-item-fast falling-item-left-mid falling-delay-2">
        <Image src="/icons/mobile.png" alt="Phone" width={60} height={60} />
      </div>
      <div className="falling-item falling-item-medium falling-item-center-left falling-delay-4">
        <Image src="/icons/earings.png" alt="earings" width={60} height={60} />
      </div>
      <div className="falling-item falling-item-fast falling-item-center falling-delay-1">
        <Image src="/icons/idcard.png" alt="ID Card" width={60} height={60} />
      </div>
      <div className="falling-item falling-item-medium falling-item-center-right falling-delay-3">
        <Image src="/icons/backpack.png" alt="Backpack" width={60} height={60} />
      </div>
      <div className="falling-item falling-item-fast falling-item-right-mid falling-delay-5">
        <Image src="/icons/laptop.png" alt="Laptop" width={60} height={60} />
      </div>
      <div className="falling-item falling-item-medium falling-item-right falling-delay-2">
        <Image src="/icons/handfree.png" alt="Headphones" width={60} height={60} />
      </div>
      <div className="falling-item falling-item-fast falling-item-far-right falling-delay-4">
        <Image src="/icons/charger.png" alt="charger" width={60} height={60} />
      </div>  
      <div className="falling-item falling-item-medium falling-item-far-left falling-delay-6">
        <Image src="/icons/driver-lisence.png" alt="driver-license" width={60} height={60} />
      </div>
      <div className="falling-item falling-item-fast falling-item-left falling-delay-3">
        <Image src="/icons/ring.png" alt="ring" width={60} height={60} />
      </div>
      <div className="falling-item falling-item-medium falling-item-left-mid falling-delay-5">
        <Image src="/icons/passport.png" alt="passport" width={60} height={60} />
      </div>
      <div className="falling-item falling-item-fast falling-item-center-left falling-delay-7">
        <Image src="/icons/std-card.png" alt="card" width={60} height={60} />
      </div>
      <div className="falling-item falling-item-medium falling-item-center falling-delay-4">
        <Image src="/icons/watchh.png" alt="watch" width={60} height={60} />
      </div>
      <div className="falling-item falling-item-fast falling-item-center-right falling-delay-6">
        <Image src="/icons/bags.png" alt="bags" width={60} height={60} />
      </div>
     
      
    
      

      {/* Navbar with glass effect */}
      <Navbar currentPage="home" />

      {/* Home Section */}
      <section className="min-h-screen flex flex-col justify-center items-center py-16 px-4 relative">
        <div className="absolute inset-0 pattern-dots"></div>
        <div className="text-center max-w-3xl z-10">
          <h1 className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-[#32230f] to-[#6c2704] bg-clip-text text-transparent animate-float">
            Welcome to the Lost and Found Website
          </h1>
          <p className="text-[#32230f] text-lg mb-8">Help us reunite lost items with their owners!</p>
          
          <div className="flex space-x-6 justify-center">
            <Link href="/report-lost" className="px-6 py-3 bg-gradient-to-r from-[#32230f] to-[#6c2704] text-white rounded-lg shadow-lg transition transform hover:scale-105">
              Report a Lost Item
            </Link>
            <Link href="/register-found" className="px-6 py-3 bg-gradient-to-r from-[#32230f] to-[#6c2704] text-white rounded-lg shadow-lg transition transform hover:scale-105">
              Report a Found Item
            </Link>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-16 px-4 glass relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-[#32230f] to-[#6c2704] bg-clip-text text-transparent animate-float">
            How it works
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            {/* Step 1 */}
            <div className="glass hover-lift text-center p-6 rounded-2xl">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-[#32230f] to-[#6c2704] rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#32230f] mb-3">Report a lost or found item</h3>
              <p className="text-[#32230f] text-sm">Fill the declaration and give as much detail as possible (the location of loss, the type of item, the description) to help the algorithm to identify it quickly</p>
            </div>

            {/* Step 2 */}
            <div className="glass hover-lift text-center p-6 rounded-2xl animation-delay-2000">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-[#32230f] to-[#6c2704] rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#32230f] mb-3">Prove ownership of the item</h3>
              <p className="text-[#32230f] text-sm">Once the lost item "matched", prove who you are thanks to a security question (ex: describe the shell of your phone, ...). Then, our partner who found this item will be able to validate that this is yours</p>
            </div>

            {/* Step 3 */}
            <div className="glass hover-lift text-center p-6 rounded-2xl animation-delay-4000">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-[#32230f] to-[#6c2704] rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#32230f] mb-3">Get it back!</h3>
              <p className="text-[#32230f] text-sm">As soon as you are authenticated, you receive the information to pick it up or have it delivered. Remember to communicate the reference's number found</p>
            </div>
          </div>
        </div>
      </section>

      <div>
      <section id="about-us" className="py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-10"></div>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-[#32230f] to-[#6c2704] bg-clip-text text-transparent animate-float">
            About Us
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="glass p-8 rounded-xl shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-20 -top-20 w-40 h-40 bg-gradient-to-br from-[#32230f] to-[#6c2704] rounded-full opacity-10 group-hover:opacity-20 transition-all duration-500"></div>
              
              <h3 className="text-2xl font-semibold mb-4 text-[#32230f] relative z-10">Our Story</h3>
              <p className="text-[#32230f] text-lg mb-6 relative z-10 animate-fadeIn">
                Lost and Found was created by a team of passionate individuals who experienced the frustration of losing valuable items and the difficulty of trying to find them. We recognized the need for a centralized platform where people could easily report lost items and register found ones.
              </p>
              
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#32230f] to-[#6c2704] rounded-full flex items-center justify-center animate-pulse">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-.35-.035-.691-.1-1.02A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="glass p-8 rounded-xl shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-2xl relative overflow-hidden group">
              <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-gradient-to-br from-[#32230f] to-[#6c2704] rounded-full opacity-10 group-hover:opacity-20 transition-all duration-500"></div>
              
              <h3 className="text-2xl font-semibold mb-4 text-[#32230f] relative z-10">Our Mission</h3>
              <p className="text-[#32230f] text-lg mb-6 relative z-10 animate-fadeIn animation-delay-300">
                Our mission is to create a user-friendly platform that helps reunite people with their lost belongings. We strive to make the process as simple and efficient as possible, ensuring that lost items find their way back to their rightful owners.
              </p>
              
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#32230f] to-[#6c2704] rounded-full flex items-center justify-center animate-pulse animation-delay-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.707.293l.707.707L15 4.414A1 1 0 0116.414 3L14 .586A1 1 0 0112.586 2l-.707.707L11 2a1 1 0 011 0zm2 5.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-5.5 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 2a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 glass p-8 rounded-xl shadow-lg max-w-6xl mx-auto transform transition-all duration-500 hover:shadow-2xl">
            <h3 className="text-2xl font-semibold mb-6 text-center text-[#32230f]">Our Values</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 hover:bg-white hover:bg-opacity-30 rounded-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-[#32230f] to-[#6c2704] rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-medium text-[#32230f] mb-2">Community</h4>
                <p className="text-sm text-[#32230f]">We believe in the power of community to help each other and make a difference.</p>
              </div>
              
              <div className="text-center p-4 hover:bg-white hover:bg-opacity-30 rounded-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-[#32230f] to-[#6c2704] rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-medium text-[#32230f] mb-2">Trust</h4>
                <p className="text-sm text-[#32230f]">We build trust through transparency and secure processes for item recovery.</p>
              </div>
              
              <div className="text-center p-4 hover:bg-white hover:bg-opacity-30 rounded-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-[#32230f] to-[#6c2704] rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
                <h4 className="font-medium text-[#32230f] mb-2">Accessibility</h4>
                <p className="text-sm text-[#32230f]">Our platform is designed to be accessible to everyone, regardless of technical ability.</p>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <div className="inline-block relative">
                <span className="relative z-10 px-6 py-3 bg-gradient-to-r from-[#32230f] to-[#6c2704] text-white rounded-lg shadow-lg inline-block transform transition hover:scale-105 cursor-pointer">
                  Join Our Community
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#32230f] to-[#6c2704] rounded-lg blur opacity-30 animate-pulse"></div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 flex justify-center">
            <div className="flex space-x-2 animate-bounce">
              <div className="w-3 h-3 bg-[#32230f] rounded-full"></div>
              <div className="w-3 h-3 bg-[#6c2704] rounded-full animation-delay-200"></div>
              <div className="w-3 h-3 bg-[#32230f] rounded-full animation-delay-400"></div>
            </div>
          </div>
        </div>
      </section>

            

        {/* Connections Section */}
        <Connections />
        </div>

        <Footer />
        
    </div>
  );
}
