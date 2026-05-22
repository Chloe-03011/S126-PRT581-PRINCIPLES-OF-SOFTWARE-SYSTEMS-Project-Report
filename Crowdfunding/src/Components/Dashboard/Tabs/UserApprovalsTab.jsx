import React from 'react';
import { motion } from 'framer-motion';
import { XCircle } from 'lucide-react';

const UserApprovalsTab = ({ 
    data, 
    processingReg, 
    handleApproveRegistration 
}) => {
    return (
        <motion.div key="user-approvals" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {data.pendingUsers.length > 0 ? data.pendingUsers.map(u => (
                <div key={u._id} className="bg-white p-4 rounded-[32px] border border-gray-100 shadow-xl shadow-text-primary/5 flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6 flex-grow">
                        <div className="w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
                            {u.profilePicture?.data ? (
                                <img 
                                    src={`data:${u.profilePicture.contentType};base64,${u.profilePicture.data}`} 
                                    alt="" 
                                    className="w-full h-full object-cover" 
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center font-bold text-gray-300 text-2xl uppercase">{u.name[0]}</div>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-grow">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">User Info</p>
                                <h3 className="text-xl font-bold text-text-primary">{u.name}</h3>
                                <p className="text-sm font-semibold text-gray-500">{u.email}</p>
                                <p className="text-xs font-semibold text-primary">{u.phone}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">National ID</p>
                                <p className="text-sm font-bold text-text-primary bg-gray-50 px-3 py-1 rounded-lg w-fit">{u.nid || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Physical Address</p>
                                <p className="text-sm font-semibold text-gray-500 leading-snug">{u.address || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            disabled={processingReg === u._id}
                            onClick={() => handleApproveRegistration(u._id, false)} 
                            className="p-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all"
                        >
                            <XCircle size={20}/>
                        </button>
                        <button 
                            disabled={processingReg === u._id}
                            onClick={() => handleApproveRegistration(u._id, true)} 
                            className="px-4 py-4 bg-green-500 text-white font-bold rounded-2xl hover:bg-green-600 transition-all shadow-lg shadow-green-500/20"
                        >
                            {processingReg === u._id ? '...' : 'APPROVE'}
                        </button>
                    </div>
                </div>
            )) : (
                <div className="py-10 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
                    <p className="text-gray-400 font-semibold uppercase tracking-widest">No pending user registrations</p>
                </div>
            )}
        </motion.div>
    );
};

export default UserApprovalsTab;
