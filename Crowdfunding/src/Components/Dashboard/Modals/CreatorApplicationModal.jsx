import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CreatorApplicationModal = ({ 
    isOpen, 
    onClose, 
    handleApplyCreator, 
    creatorForm, 
    setCreatorForm, 
    applyingCreator 
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/10 backdrop-blur-sm" />
                    <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="bg-white w-full max-w-lg rounded-lg shadow-sm relative z-10 overflow-hidden border border-border-light" >
                        <div className="p-8">
                            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-4">Verification</p>
                            <h2 className="text-3xl font-bold text-text-primary uppercase tracking-tighter mb-2">Become a Creator</h2>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-8">Please provide additional information for verification.</p>
                            <form onSubmit={handleApplyCreator} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">ID Number</label>
                                    <input required className="w-full bg-background border border-border-light focus:ring-1 focus:ring-primary focus:border-primary outline-none px-4 py-3 rounded-lg font-bold text-sm transition-all" value={creatorForm.nid} onChange={e => setCreatorForm({...creatorForm, nid: e.target.value})} placeholder="XXXX-XXXX-XXXX" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Address</label>
                                    <input required className="w-full bg-background border border-border-light focus:ring-1 focus:ring-primary focus:border-primary outline-none px-4 py-3 rounded-lg font-bold text-sm transition-all" value={creatorForm.address} onChange={e => setCreatorForm({...creatorForm, address: e.target.value})} placeholder="House, Road, City" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                    <input required className="w-full bg-background border border-border-light focus:ring-1 focus:ring-primary focus:border-primary outline-none px-4 py-3 rounded-lg font-bold text-sm transition-all" value={creatorForm.phone} onChange={e => setCreatorForm({...creatorForm, phone: e.target.value})} placeholder="+880 1XXX-XXXXXX" />
                                </div>
                                <button disabled={applyingCreator} type="submit" className="w-full bg-primary text-white py-4 rounded-lg font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50" >
                                    {applyingCreator ? 'Submitting...' : 'Ready to Start'}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CreatorApplicationModal;
