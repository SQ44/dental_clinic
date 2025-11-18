'use client';

import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { paymentsApi } from '@/lib/api';
import { Invoice } from '@/types';

interface CheckoutFormProps {
  invoice: Invoice;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CheckoutForm({ invoice, onSuccess, onCancel }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create payment intent
      const payment = await paymentsApi.createPaymentIntent({
        invoiceId: invoice.id,
        amount: invoice.totalAmount,
      });

      // Confirm payment
      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/billing/${invoice.id}?payment=success`,
        },
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
      } else {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Pay Invoice #{invoice.id}</h2>

      <div className="mb-4">
        <div className="text-sm text-gray-600">
          <p>Patient: {invoice.patient.firstName} {invoice.patient.lastName}</p>
          <p>Amount: ${invoice.totalAmount.toFixed(2)}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <PaymentElement />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={!stripe || isProcessing}
          >
            {isProcessing ? 'Processing...' : `Pay $${invoice.totalAmount.toFixed(2)}`}
          </button>
        </div>
      </form>
    </div>
  );
}