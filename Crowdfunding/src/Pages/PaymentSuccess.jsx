import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const PaymentSuccess = () => {
    const { tranId } = useParams();
    const [loading, setLoading] = useState(true);
    const [donation, setDonation] = useState(null);
    const hasCalled = React.useRef(false);

    useEffect(() => {
        const verifyPayment = async () => {
            if (hasCalled.current) return;
            hasCalled.current = true;
            
            try {
                let response;
                if (tranId.startsWith('STRIPE_')) {
                    const sessionId = tranId.replace('STRIPE_', '');
                    response = await api.post(`/payment/stripe-success/${sessionId}`);
                } else if (tranId.startsWith('PAYPAL_') || tranId.startsWith('MOCK_PAYPAL_')) {
                    response = await api.post(`/payment/paypal-success/${tranId}`);
                } else {
                    response = await api.post(`/payment/ssl-success/${tranId}`);
                }
                setDonation(response.data.donation);
            } catch (error) {
                console.error('Verification error:', error);
            } finally {
                setLoading(false);
            }
        };
        verifyPayment();
    }, [tranId]);

    if (loading) return (
        <div className="min-h-screen bg-custom-white flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-custom-yellow mb-4"></div>
            <p className="font-black text-xl uppercase tracking-widest text-custom-black">Verifying Transaction...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-custom-white flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white rounded-[40px] p-12 shadow-2xl border border-gray-100 text-center"
            >
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-500/20">
                    <CheckCircle size={48} className="text-white" />
                </div>
                
                <h1 className="text-4xl font-black text-custom-black mb-4">AWESOME!</h1>
                <p className="text-gray-500 font-bold mb-8">
                    Your contribution has been successfully processed. You're officially a backer!
                </p>

                <div className="bg-gray-50 rounded-3xl p-6 mb-8 text-left space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400 font-bold uppercase tracking-widest">Transaction ID</span>
                        <span className="text-custom-black font-black">{tranId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400 font-bold uppercase tracking-widest">Amount Paid</span>
                        <span className="text-custom-blue font-black">{donation?.amount} {donation?.currency}</span>
                    </div>
                </div>

                <div className="grid gap-4">
                    <Link to="/dashboard" className="w-full bg-custom-black text-custom-white py-5 rounded-2xl font-black text-lg hover:bg-gray-900 transition-all flex items-center justify-center gap-2">
                        View Dashboard
                        <ArrowRight size={20} className="text-custom-yellow" />
                    </Link>
                    <Link to="/" className="text-gray-400 font-bold hover:text-custom-black transition-colors flex items-center justify-center gap-2">
                        <Home size={18} />
                        Back to Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default PaymentSuccess;
