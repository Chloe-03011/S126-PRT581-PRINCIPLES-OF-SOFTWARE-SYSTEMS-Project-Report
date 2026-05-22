import React from 'react';
import { 
    LayoutDashboard, 
    Layers, 
    Users as UsersIcon, 
    Wallet, 
    Settings, 
    CheckCircle, 
    ShieldAlert, 
    Heart, 
    ArrowUpRight, 
    Rocket, 
    DollarSign, 
    Eye 
} from 'lucide-react';

const Sidebar = ({ user, isAdmin, isCreator, activeTab, setSearchParams }) => {
    const SidebarLink = ({ id, icon: Icon, label }) => (
        <div 
            onClick={() => setSearchParams({ tab: id })}
            className={`w-full flex items-start gap-4 px-4 py-3.5 rounded-lg font-bold text-[10px] uppercase tracking-[0.2em] transition-all ${
                activeTab === id 
                ? 'bg-white text-primary border border-border-light shadow-sm' 
                : 'text-gray-400 hover:bg-gray-50 hover:text-text-primary'
            }`}
        >
            <Icon size={18} />
            {label}
        </div>
    );

    return (
        <aside className="w-full lg:w-72 bg-white border-r border-border-light p-4 space-y-1">
            <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-4 mt-2">Workspace</p>
            <SidebarLink id="overview" icon={LayoutDashboard} label="Dashboard" />
            
            {isAdmin && (
                <>
                    <p className="px-4 pt-8 text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-4">Admin Hub</p>
                    <SidebarLink id="approvals" icon={ShieldAlert} label="New Projects" />
                    <SidebarLink id="user-approvals" icon={CheckCircle} label="Creator Reviews" />
                    <SidebarLink id="users" icon={UsersIcon} label="Users" />
                    <SidebarLink id="success-stories" icon={Rocket} label="Project Impact Updates" />
                    <SidebarLink id="finance" icon={DollarSign} label="Payment Portal" />
                    <SidebarLink id="fulfillment-monitor" icon={Eye} label="Project Completion Tracking" />
                </>
            )}

            {isCreator && (
                <>
                    <p className="px-4 pt-8 text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-4">Creator Tools</p>
                    <SidebarLink id="my-projects" icon={Layers} label="My Projects" />
                    <SidebarLink id="updates" icon={Rocket} label="Project Updates" />
                    <SidebarLink id="backer-management" icon={UsersIcon} label="Supporter Connection" />
                    <SidebarLink id="contributions" icon={Wallet} label="My Support History" />
                    <SidebarLink id="withdrawals" icon={ArrowUpRight} label="Payments" />
                </>
            )}

            <p className="px-4 pt-8 text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-4">Account</p>
            <SidebarLink id="backed-projects" icon={Layers} label="Supported Projects" />
            <SidebarLink id="donations" icon={Heart} label="Contributions" />
            <SidebarLink id="settings" icon={Settings} label="Account Settings" />
        </aside>
    );
};

export default Sidebar;
