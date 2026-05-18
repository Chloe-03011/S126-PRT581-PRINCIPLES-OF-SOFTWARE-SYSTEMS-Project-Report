import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Components/Shared/Navbar';
import Footer from '../Components/Shared/Footer';

const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-custom-white">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
