import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';

const AgreementModal = ({ isOpen, onClose, bookingDetails, onConfirm, loading }) => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    
    // Reset state when opened
    setHasScrolledToBottom(false);
    setAgreed(false);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasScrolledToBottom(true);
        }
      },
      { threshold: 1.0 }
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => observer.disconnect();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="bg-sand w-full max-w-3xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-forest p-6 flex justify-between items-center text-sand">
            <h2 className="text-2xl font-serif font-bold">Booking Agreement — The Nest Stay</h2>
            <button onClick={onClose} className="hover:text-amber transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-white">
            
            <section>
              <h3 className="text-xl font-bold text-forest border-b pb-2 mb-4">Booking Details</h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm md:text-base">
                <div><span className="text-gray-500">Guest Name:</span> <span className="font-medium text-charcoal">{bookingDetails.user.name}</span></div>
                <div><span className="text-gray-500">Mobile:</span> <span className="font-medium text-charcoal">+91 {bookingDetails.user.mobile}</span></div>
                <div><span className="text-gray-500">Email:</span> <span className="font-medium text-charcoal">{bookingDetails.user.email}</span></div>
                <div><span className="text-gray-500">Room Type:</span> <span className="font-medium text-charcoal">{bookingDetails.room_type === 'single' ? 'Single Room' : 'Double Room Set'}</span></div>
                <div><span className="text-gray-500">Check-in:</span> <span className="font-medium text-charcoal">{new Date(bookingDetails.checkin).toLocaleDateString()}</span></div>
                <div><span className="text-gray-500">Check-out:</span> <span className="font-medium text-charcoal">{new Date(bookingDetails.checkout).toLocaleDateString()}</span></div>
                <div><span className="text-gray-500">Nights:</span> <span className="font-medium text-charcoal">{bookingDetails.nights}</span></div>
                <div><span className="text-gray-500">Guests:</span> <span className="font-medium text-charcoal">{bookingDetails.user.guests_count}</span></div>
                <div><span className="text-gray-500">ID Proof:</span> <span className="font-medium text-charcoal">{bookingDetails.user.id_type} ({bookingDetails.user.id_number})</span></div>
              </div>
              <div className="mt-6 p-4 bg-sand rounded-lg border border-amber/30 text-center">
                <span className="text-lg text-forest">Total Amount:</span>
                <span className="ml-2 text-2xl font-bold text-amber">₹{bookingDetails.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </section>

            <section className="text-gray-700 text-sm leading-relaxed space-y-4">
              <h3 className="text-xl font-bold text-forest border-b pb-2 mb-4">Terms & Conditions</h3>
              <p>1. Check-in time is 1:00 PM and Check-out time is 11:00 AM. Early check-in or late check-out is subject to availability and may incur additional charges.</p>
              <p>2. A valid government-issued photo ID (Aadhaar, Passport, Driving License, or Voter ID) is mandatory for all guests at the time of check-in. PAN cards are not accepted as valid address proof.</p>
              <p>3. The total booking amount must be settled prior to or at the time of check-in. Any additional services (meals, laundry, travel desk) will be billed separately.</p>
              <p>4. <strong>Cancellation Policy:</strong> Cancellations made 7 days prior to check-in will receive a full refund. Cancellations made within 48-72 hours will incur a 50% retention charge. No refunds will be provided for cancellations made within 24 hours of check-in or for no-shows.</p>
              <p>5. The Nest Stay is a tranquil retreat. We kindly request guests to maintain decorum and keep noise levels down after 10:00 PM.</p>
              <p>6. Pets are not allowed on the premises unless pre-approved by the management in writing.</p>
              <p>7. Guests will be held responsible for any damage to the property caused by them or their visitors, and the cost of repair or replacement will be charged to their account.</p>
              
              <div ref={bottomRef} className="h-4 w-full"></div>
            </section>
          </div>

          {/* Footer Action */}
          <div className="bg-gray-50 p-6 border-t flex flex-col md:flex-row justify-between items-center gap-4">
            <label className={`flex items-center space-x-3 cursor-pointer ${!hasScrolledToBottom ? 'opacity-50' : ''}`}>
              <input 
                type="checkbox" 
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                disabled={!hasScrolledToBottom}
                className="w-5 h-5 text-forest border-gray-300 rounded focus:ring-forest accent-forest"
              />
              <span className="text-sm font-medium text-gray-700">
                {hasScrolledToBottom ? "I have read and agree to the terms and conditions" : "Scroll to the bottom to agree"}
              </span>
            </label>
            
            <button 
              onClick={onConfirm}
              disabled={!agreed || loading}
              className={`px-8 py-3 rounded-md font-bold text-white transition-all ${agreed && !loading ? 'bg-amber hover:bg-amber-hover shadow-lg' : 'bg-gray-400 cursor-not-allowed'}`}
            >
              {loading ? 'Confirming...' : 'Confirm Booking'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AgreementModal;
