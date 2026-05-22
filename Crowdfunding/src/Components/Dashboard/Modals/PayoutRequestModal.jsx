import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet } from 'lucide-react';

const PayoutRequestModal = ({ 
    isOpen, 
    onClose, 
    handleRequestPayout, 
    withdrawalStats, 
    payoutForm, 
    setPayoutForm, 
    requestingPayout 
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-2">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-text-primary/80 backdrop-blur-sm" />
                    <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden" >
                        <div className="p-4 md:p-6">
                            <h2 className="text-3xl font-bold text-text-primary uppercase tracking-tighter mb-2 flex items-center gap-3">
                                <Wallet className="text-primary" /> Request Funds
                            </h2>
                            <p className="text-gray-500 font-semibold mb-4">Funds will be transferred to your specified account after admin review.</p>
                            <form onSubmit={handleRequestPayout} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Amount to Withdraw (Max: ${withdrawalStats?.currentAvailable})</label>
                                    <input required type="number" max={withdrawalStats?.currentAvailable} className="w-full bg-gray-50 border-2 border-transparent focus:border-primary outline-none px-3 py-4 rounded-2xl font-semibold transition-all" value={payoutForm.amount} onChange={e => setPayoutForm({...payoutForm, amount: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">How to Receive</label>
                                    <select className="w-full bg-gray-50 border-2 border-transparent focus:border-primary outline-none px-3 py-4 rounded-2xl font-semibold transition-all" value={payoutForm.method} onChange={e => setPayoutForm({...payoutForm, method: e.target.value})}>
                                        <option>Bank Transfer</option>
                                        <option>Mobile Money (Bkash)</option>
                                        <option>Mobile Money (Nagad)</option>
                                        <option>PayPal</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Account Info (Number / IBAN)</label>
                                    <input required className="w-full bg-gray-50 border-2 border-transparent focus:border-primary outline-none px-3 py-4 rounded-2xl font-semibold transition-all" value={payoutForm.accountNumber} onChange={e => setPayoutForm({...payoutForm, accountNumber: e.target.value})} placeholder="e.g. 017XXXXXXXX or Account No." />
                                </div>
                                <button disabled={requestingPayout} type="submit" className="w-full bg-background text-text-primary py-5 rounded-2xl font-bold text-lg hover:bg-gray-900 hover:text-white transition-all shadow-xl shadow-text-primary/10 disabled:opacity-50" >
                                    {requestingPayout ? 'REQUESTING...' : 'CONFIRM REQUEST'}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PayoutRequestModal;
