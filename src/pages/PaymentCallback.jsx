import { useEffect, useState } from "react";
import { authUrl } from "../api";
import { CheckCircle2, XCircle } from "lucide-react";
import { PrimaryButton } from "../components/ui";

export function PaymentCallback({ onNavigate }) {
  const [status, setStatus] = useState("processing"); // processing, success, failed
  const [message, setMessage] = useState("Verifying your payment with bKash...");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentID = urlParams.get('paymentID');
    const statusParam = urlParams.get('status');

    if (statusParam !== 'success') {
      setStatus("failed");
      setMessage("Payment was cancelled or failed.");
      return;
    }

    if (!paymentID) {
      setStatus("failed");
      setMessage("Invalid payment callback.");
      return;
    }

    // Execute the payment
    fetch(authUrl('/api/bkash/execute'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentID }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.statusCode === '0000') {
          setStatus("success");
          setMessage("Payment successful!");
        } else {
          setStatus("failed");
          setMessage(data.statusMessage || "Payment execution failed.");
        }
      })
      .catch(err => {
        setStatus("failed");
        setMessage("An error occurred while verifying the payment.");
      });
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
        {status === "processing" && (
          <div className="animate-pulse">
            <div className="mx-auto h-16 w-16 rounded-full bg-blue-100 p-4 mb-4 flex items-center justify-center">
               <span className="text-xl font-bold text-blue-500">...</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Processing...</h2>
            <p className="mt-2 text-gray-500">{message}</p>
          </div>
        )}

        {status === "success" && (
          <div>
            <CheckCircle2 size={64} className="mx-auto mb-4 text-green-500" />
            <h2 className="text-2xl font-bold text-gray-800">Payment Successful!</h2>
            <p className="mt-2 text-gray-500">{message}</p>
            <div className="mt-8">
              <PrimaryButton full onClick={() => {
                // Remove query params
                window.history.replaceState({}, document.title, "/");
                onNavigate("summary");
              }}>
                Return to Dashboard
              </PrimaryButton>
            </div>
          </div>
        )}

        {status === "failed" && (
          <div>
            <XCircle size={64} className="mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-800">Payment Failed</h2>
            <p className="mt-2 text-gray-500">{message}</p>
            <div className="mt-8">
              <PrimaryButton full onClick={() => {
                window.history.replaceState({}, document.title, "/");
                onNavigate("payments");
              }}>
                Try Again
              </PrimaryButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
