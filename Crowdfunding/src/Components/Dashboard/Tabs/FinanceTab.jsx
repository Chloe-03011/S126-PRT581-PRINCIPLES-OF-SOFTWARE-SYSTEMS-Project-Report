import React from 'react';
import { motion } from 'framer-motion';
import { XCircle } from 'lucide-react';

const FinanceTab = ({ 
    financeSubTab, 
    setFinanceSubTab, 
    data, 
    updatingBackerStatus, 
    handleUpdateWithdrawalStatus 
}) => {
    return (
        <motion.div key="finance" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {/* Finance Sub-Tabs */}
            <div className="flex gap-4 p-1 bg-gray-200/50 rounded-2xl w-fit">
                <button 
                    onClick={() => setFinanceSubTab('donations')}
                    className={`px-4 py-3 rounded-xl font-bold text-sm uppercase tracking-widest transition-all ${
                        financeSubTab === 'donations' 
                        ? 'bg-white text-text-primary shadow-md' 
                        : 'text-gray-500 hover:text-text-primary'
                    }`}
                >
                    Community Support
                </button>
                <button 
                    onClick={() => setFinanceSubTab('payments')}
                    className={`px-4 py-3 rounded-xl font-bold text-sm uppercase tracking-widest transition-all ${
                        financeSubTab === 'payments' 
                        ? 'bg-white text-text-primary shadow-md' 
                        : 'text-gray-500 hover:text-text-primary'
                    }`}
                >
                    Payout History
                </button>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-text-primary/5 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-4 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {financeSubTab === 'donations' ? 'Supporter / Project' : 'Creator / Project'}
                    </th>
                    <th className="px-4 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{financeSubTab === 'donations' ? 'Amount' : 'Net Payout'}</th>
                    {financeSubTab === 'payments' && <th className="px-4 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Breakdown</th>}
                    <th className="px-4 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gateway / Method</th>
                    <th className="px-4 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-4 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Date</th>
                    <th className="px-4 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                    {financeSubTab === 'donations' ? (
                    data.allDonations.length > 0 ? data.allDonations.map(d => (
                        <tr key={d._id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-4 py-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                        {d.isAnonymous ? 'A' : (d.backerId?.name?.[0] || '?')}
                                    </div>
                                    <div>
                                        <p className="font-bold text-text-primary">
                                            {d.isAnonymous ? 'Anonymous Supporter' : (d.backerId?.name || 'Unknown User')}
                                        </p>
                                        <p className="text-xs font-semibold text-gray-400 truncate max-w-[200px]">
                                            {d.campaignId?.title || 'Deleted Campaign'}
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-6">
                                <p className="font-bold text-text-primary">{d.amount} {d.currency}</p>
                            </td>
                            <td className="px-4 py-6">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{d.payment?.gateway}</span>
                            </td>
                            <td className="px-4 py-6">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                    d.status === 'charged' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                                }`}>
                                    {d.status}
                                </span>
                            </td>
                            <td className="px-4 py-6 text-right text-xs font-semibold text-gray-400">
                                {new Date(d.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-6 text-right">
                               -
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan="6" className="px-4 py-10 text-center text-gray-400 font-semibold uppercase tracking-widest">No donations found</td></tr>
                    )
                    ) : (
                    data.allWithdrawals.length > 0 ? data.allWithdrawals.map(w => (
                        <tr key={w._id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-4 py-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center font-bold text-primary">
                                        {w.creatorId?.name?.[0] || '?'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-text-primary">{w.creatorId?.name || 'Unknown Creator'}</p>
                                        <p className="text-xs font-semibold text-gray-400 truncate max-w-[200px]">{w.campaignId?.title || 'Deleted Campaign'}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-6">
                                <div className="flex flex-col items-center gap-2">
                                    <p className="font-bold text-text-primary">${w.netAmount?.toLocaleString()}</p>
                                    <span className={`px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-tighter ${
                                        w.stage === 1 ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                                    }`}>
                                        Stage {w.stage || 1} ({w.stage === 2 ? '30%' : '70%'})
                                    </span>
                                </div>
                            </td>
                            <td className="px-4 py-6 text-center">
                                <div className="flex flex-col items-center gap-0.5">
                                    <p className="text-[10px] font-semibold text-green-600 uppercase tracking-tighter">Gross: ${w.requestedAmount?.toLocaleString()}</p>
                                    <p className="text-[10px] font-semibold text-red-500 uppercase tracking-tighter">Fee: -${w.platformFee?.toLocaleString()}</p>
                                </div>
                            </td>
                            <td className="px-4 py-6">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{w.method} • {w.accountNumber}</span>
                            </td>
                            <td className="px-4 py-6">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                    w.status === 'completed' ? 'bg-green-100 text-green-600' : 
                                    w.status === 'rejected' ? 'bg-red-100 text-red-600' : 
                                    w.status === 'approved' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'
                                }`}>
                                    {w.status}
                                </span>
                                {w.rejectionReason && <p className="text-[9px] text-red-400 mt-1 font-semibold">Reason: {w.rejectionReason}</p>}
                            </td>
                            <td className="px-4 py-6 text-right text-xs font-semibold text-gray-400">
                                {new Date(w.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-6 text-right">
                               {w.status === 'pending' && (
                                   <div className="flex justify-end gap-2">
                                       <button 
                                           disabled={updatingBackerStatus === w._id}
                                           onClick={() => handleUpdateWithdrawalStatus(w._id, 'rejected')} 
                                           className="p-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                                       >
                                           <XCircle size={16}/>
                                       </button>
                                       <button 
                                           disabled={updatingBackerStatus === w._id}
                                           onClick={() => handleUpdateWithdrawalStatus(w._id, 'approved')} 
                                           className="px-3 py-1 bg-green-500 text-white font-bold text-[10px] rounded-lg hover:bg-green-600 transition-all"
                                       >
                                           APPROVE
                                       </button>
                                   </div>
                               )}
                               {w.status === 'approved' && (
                                   <button 
                                       disabled={updatingBackerStatus === w._id}
                                       onClick={() => handleUpdateWithdrawalStatus(w._id, 'completed')} 
                                       className="px-3 py-1 bg-background text-text-primary font-bold text-[10px] rounded-lg hover:bg-cream hover:text-text-primary transition-all"
                                   >
                                       MARK COMPLETE
                                   </button>
                               )}
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan="7" className="px-4 py-10 text-center text-gray-400 font-semibold uppercase tracking-widest">No withdrawals found</td></tr>
                    )
                    )}                                                    </tbody>                                        </table>
            </div>
        </motion.div>
    );
};

export default FinanceTab;
