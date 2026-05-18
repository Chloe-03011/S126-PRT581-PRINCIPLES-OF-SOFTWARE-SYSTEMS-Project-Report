import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Target, Users, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
    const steps = [
        {
            icon: <Rocket className="w-8 h-8 text-custom-yellow" />,
            title: "Create Your Campaign",
            description: "Share your vision with the world. Set your funding goal, choose your category, and tell your story with compelling images and videos."
        },
        {
            icon: <Target className="w-8 h-8 text-custom-blue" />,
            title: "Set Your Goals",
            description: "Define clear milestones and reward tiers for your backers. Be transparent about how the funds will be used to bring your project to life."
        },
        {
            icon: <Users className="w-8 h-8 text-custom-yellow" />,
            title: "Engage Your Community",
            description: "Spread the word! Use our social sharing tools to reach potential backers. Build trust through regular updates and direct communication."
        },
        {
            icon: <Zap className="w-8 h-8 text-custom-blue" />,
            title: "Receive Funding",
            description: "Once your campaign gains momentum and hits its goal, receive the funds securely to start working on your project and fulfilling rewards."
        }
    ];

    return (
        <div className="bg-custom-white min-h-screen">
            {/* Hero Section */}
            <section className="bg-custom-black text-custom-white py-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-full h-full bg-grad-yellow"></div>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-8xl font-black mb-8 tracking-tighter"
                    >
                        HOW IT <span className="text-custom-yellow">WORKS</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-medium"
                    >
                        From a spark of an idea to a fully funded reality. 
                        We provide the platform, you provide the vision.
                    </motion.p>
                </div>
            </section>

            {/* Steps Section */}
            <section className="py-24 max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {steps.map((step, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative group"
                        >
                            <div className="mb-6 w-16 h-16 bg-custom-black rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-xl">
                                {step.icon}
                            </div>
                            <h3 className="text-2xl font-black text-custom-black mb-4 uppercase tracking-tight">{step.title}</h3>
                            <p className="text-gray-600 font-bold leading-relaxed">{step.description}</p>
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-8 -right-6 text-gray-200">
                                    <ArrowRight size={24} />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="bg-gray-50 py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="lg:w-1/2">
                            <h2 className="text-4xl md:text-5xl font-black text-custom-black mb-8 leading-tight">
                                WHY THE WORLD <span className="text-custom-blue">TRUSTS</span> OUR PLATFORM
                            </h2>
                            <div className="space-y-6">
                                {[
                                    "Secure payment processing with global standards.",
                                    "Zero hidden fees for backers and transparent pricing.",
                                    "Comprehensive creator tools and analytics dashboard.",
                                    "Dedicated support team for every step of your journey."
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="mt-1 bg-custom-yellow rounded-full p-1">
                                            <CheckCircle size={20} className="text-custom-black" />
                                        </div>
                                        <p className="text-lg font-bold text-gray-700">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:w-1/2 bg-custom-black p-12 rounded-[40px] relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-custom-yellow opacity-10 blur-[100px]"></div>
                            <div className="relative z-10">
                                <h3 className="text-3xl font-black text-custom-white mb-6">Ready to start?</h3>
                                <p className="text-gray-400 mb-8 text-lg font-medium">Join thousands of creators who have turned their dreams into reality.</p>
                                <Link to="/create-campaign" className="inline-flex items-center gap-3 bg-custom-yellow text-custom-black px-10 py-5 rounded-full font-black text-xl hover:scale-105 transition-transform">
                                    Launch Project <ArrowRight size={24} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HowItWorks;
