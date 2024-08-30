import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Success = () => {
  const location = useLocation();
  const [transactionData, setTransactionData] = useState(null);
  const [error, setError] = useState('');

  // Function to fetch transaction data based on the transaction ID from the query parameter
  const fetchTransactionData = async (tran_id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/transaction/${tran_id}`);
      setTransactionData(response.data);
    } catch (error) {
      setError('Error fetching transaction data: ' + error.message);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tran_id = params.get('invoice'); // Retrieves the transaction ID from the URL query parameter
    if (tran_id) {
      fetchTransactionData(tran_id);
    } else {
      setError('Transaction ID not found in URL');
    }
  }, [location]);

  const downloadPDF = () => {
    const input = document.getElementById('invoice-content');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: [input.clientWidth, input.clientHeight],
      });
      pdf.addImage(imgData, 'PNG', 0, 0);
      pdf.save('invoice.pdf');
    });
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!transactionData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div id="invoice-content" className="text-center border border-black p-6">
        <h1 className="text-3xl font-bold mb-4 text-green-600">Payment Successful</h1>
        <p className="mb-4">Thank you for your payment!</p>
        <p className="text-sm text-gray-500">Transaction ID: {transactionData.transaction_id}</p>
        <p className="text-sm text-gray-500">Name: {transactionData.name}</p>
        <p className="text-sm text-gray-500">Age: {transactionData.age}</p>
        <p className="text-sm text-gray-500">Blood Group: {transactionData.blood_group}</p>
        <p className="text-sm text-gray-500">Amount: {transactionData.amount} {transactionData.currency}</p>
        <button
          onClick={() => window.print()}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
        >
          Print Ticket
        </button>
        <button
          onClick={downloadPDF}
          className="mt-4 ml-2 bg-gray-500 text-white py-2 px-4 rounded"
        >
          Download Ticket
        </button>
      </div>
    </div>
  );
};

export default Success;
