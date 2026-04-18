const BASE_URL = "https://moko.gofreshpay.com/api/v1";

export interface InitiatePaymentPayload {
  merchant_id: string;
  merchant_secrete: string;
  amount: string;
  currency: string;
  action: "debit" | "credit";
  customer_number: string;
  firstname: string;
  lastname: string;
  email: string;
  reference: string;
  method: "airtel" | "vodacom" | "orange" | "afrimoney";
  callback_url: string;
}

export async function initiatePayment(payload: InitiatePaymentPayload) {
  const res = await fetch(`${BASE_URL}/payments/initiate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Payment initiation failed");
  }

  return data;
}