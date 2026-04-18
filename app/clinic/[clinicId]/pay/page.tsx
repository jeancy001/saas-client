"use client";

import { useState } from "react";
import { initiatePayment } from "@/lib/gofreshpay";

export default function PayPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<any>(null);

  const handlePayment = async () => {
    setLoading(true);
    setStatus(null);

    try {
      const res = await initiatePayment({
        merchant_id: "j(Vh5ryquKiktYn]b",
        merchant_secrete: "jzUO231dHApEZm6nxb",
        amount: "100",
        currency: "CDF",
        action: "debit",
        customer_number: "0998912287",
        firstname: "NESTOR",
        lastname: "MULA",
        email: "nestormula@gmail.com",
        reference: `ref_${Date.now()}`,
        method: "airtel",
        callback_url: "https://your-domain.com/api/payment/callback",
      });

      setStatus(res);
    } catch (err: any) {
      setStatus({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-semibold">Payment Test</h1>

      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-black text-white p-3 rounded"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>

      {status && (
        <pre className="bg-gray-100 p-3 text-xs overflow-auto">
          {JSON.stringify(status, null, 2)}
        </pre>
      )}
    </div>
  );
}