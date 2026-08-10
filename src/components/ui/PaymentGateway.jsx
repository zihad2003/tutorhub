import { useState } from "react";
import { CheckCircle2, XCircle, CreditCard, Lock, ShieldCheck } from "lucide-react";
import { C } from "../../constants/tokens";

export function PaymentGateway({ method, amount, onComplete, onCancel }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleProceed = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (step === 1) {
      setTimeout(() => {
        setLoading(false);
        setStep(2); // Go to PIN/OTP
      }, 1000);
    } else {
      try {
        // Step 2: Confirming the PIN, call the API in the background
        const createRes = await fetch('/api/bkash/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: amount, reference: 'TutorHub' })
        });
        const createData = await createRes.json();
        
        if (createData.paymentID) {
          // Immediately execute it
          const executeRes = await fetch('/api/bkash/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentID: createData.paymentID })
          });
          const executeData = await executeRes.json();
          
          if (executeData.statusCode === '0000') {
            setStep(3); // Success
            setTimeout(() => {
              onComplete();
            }, 2000);
          } else {
            alert('Payment failed: ' + (executeData.statusMessage || 'Unknown error'));
            setStep(1);
          }
        } else {
          alert('Failed to initiate payment.');
          setStep(1);
        }
      } catch (err) {
        alert('An error occurred during payment processing.');
        setStep(1);
      } finally {
        setLoading(false);
      }
    }
  };

  if (method === "bkash") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        <div className="w-full max-w-[400px] overflow-hidden rounded-lg bg-white shadow-2xl">
          {/* bKash Header */}
          <div className="flex flex-col items-center bg-[#E2136E] px-6 py-8 text-white relative">
            <button onClick={onCancel} className="absolute right-4 top-4 text-white/80 hover:text-white">
              <XCircle size={24} />
            </button>
            <div className="flex h-12 items-center justify-center rounded bg-white px-4 text-[#E2136E] font-bold text-2xl tracking-wider">
              bKash
            </div>
          </div>
          
          <div className="bg-[#E2136E]/10 p-4 text-center">
            <p className="text-sm font-semibold text-[#E2136E]">TutorHub Platform</p>
            <p className="text-2xl font-bold text-[#E2136E]">৳ {amount}</p>
          </div>

          <div className="p-6">
            {step === 1 && (
              <form onSubmit={handleProceed} className="space-y-6">
                <div className="text-center text-sm text-gray-600 mb-6">
                  Enter your bKash Account Number
                </div>
                <input
                  type="text"
                  placeholder="e.g 01XXXXXXXXX"
                  required
                  className="w-full border-b-2 border-gray-300 px-2 py-3 text-center text-lg outline-none transition-colors focus:border-[#E2136E]"
                />
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <input type="checkbox" required className="accent-[#E2136E]" />
                  I agree to the terms and conditions
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={onCancel} className="flex-1 rounded bg-gray-200 py-3 font-semibold text-gray-700 hover:bg-gray-300">
                    CLOSE
                  </button>
                  <button type="submit" disabled={loading} className="flex-1 rounded bg-[#E2136E] py-3 font-semibold text-white hover:bg-[#c90d5f]">
                    {loading ? "PROCESSING..." : "PROCEED"}
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleProceed} className="space-y-6">
                <div className="text-center text-sm text-gray-600 mb-6">
                  Enter PIN for your bKash Account
                </div>
                <input
                  type="password"
                  placeholder="Enter bKash PIN"
                  required
                  className="w-full border-b-2 border-gray-300 px-2 py-3 text-center text-lg tracking-widest outline-none transition-colors focus:border-[#E2136E]"
                />
                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 rounded bg-gray-200 py-3 font-semibold text-gray-700 hover:bg-gray-300">
                    BACK
                  </button>
                  <button type="submit" disabled={loading} className="flex-1 rounded bg-[#E2136E] py-3 font-semibold text-white hover:bg-[#c90d5f]">
                    {loading ? "VERIFYING..." : "CONFIRM"}
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <div className="flex flex-col items-center py-8">
                <CheckCircle2 size={64} className="text-green-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-800">Payment Successful</h3>
                <p className="text-gray-500 mt-2 text-sm text-center">Redirecting you back to TutorHub...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Credit Card Gateway
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[450px] overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4 bg-gray-50">
          <div className="flex items-center gap-2">
            <ShieldCheck size={24} className="text-blue-600" />
            <span className="font-semibold text-gray-800">Secure Checkout</span>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <XCircle size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 rounded-lg bg-blue-50 p-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-blue-900">Total Amount</span>
            <span className="text-xl font-bold text-blue-700">৳ {amount}</span>
          </div>

          {step === 1 ? (
            <form onSubmit={handleProceed} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    required
                    className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <CreditCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">CVV</label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="123"
                      required
                      className="w-full rounded-lg border border-gray-300 pl-4 pr-10 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <Lock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-blue-600 py-3.5 font-bold text-white shadow-md hover:bg-blue-700 hover:shadow-lg transition-all"
                >
                  {loading ? "Processing..." : `Pay ৳ ${amount}`}
                </button>
              </div>
              <p className="mt-4 text-center text-xs text-gray-400">
                Payments are securely processed and encrypted.
              </p>
            </form>
          ) : step === 2 ? (
            <form onSubmit={handleProceed} className="space-y-6">
              <div className="text-center text-sm text-gray-600 mb-4">
                Enter the OTP sent to your registered mobile number ending in **45
              </div>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-lg tracking-[0.5em] outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 py-3.5 font-bold text-white shadow hover:bg-blue-700"
              >
                {loading ? "Verifying..." : "Confirm OTP"}
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center py-8">
              <div className="rounded-full bg-green-100 p-3 mb-4">
                <CheckCircle2 size={48} className="text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Payment Successful!</h3>
              <p className="text-gray-500 mt-2 text-sm text-center">Your transaction has been processed.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
