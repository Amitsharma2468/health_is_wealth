import React from 'react';
import { useLocation } from 'react-router-dom';

const Success = () => {
  const location = useLocation();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4 text-green-600">Payment Successful</h1>
        <p className="mb-4">Thank you for your payment!</p>
        <p className="text-sm text-gray-500">Transaction ID: {location.state && location.state.transactionId}</p>
      </div>
    </div>
  );
};

export default Success;
