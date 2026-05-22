import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Target, Users, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
    const steps = [
        {
            icon: <Rocket className="w-8 h-8 text-primary" />,
            title: "Create Your Campaign",
            description: "Share your vision with the world. Set your funding goal, choose your category, and tell your story with compelling images and videos."
        },
        {
            icon: <Target className="w-8 h-8 text-primary" />,
            title: "Set Your Goals",
            description: "Define clear milestones and reward tiers for your backers. Be transparent about how the funds will be used to bring your project to life."
        },
        {
            icon: <Users className="w-8 h-8 text-primary" />,
            title: "Engage Your Community",
            description: "Spread the word! Use our social sharing tools to reach potential backers. Build trust through regular updates and direct communication."
        },
        {
            icon: <Zap className="w-8 h-8 text-primary" />,
            title: "Receive Funding",
            description: "Once your campaign gains momentum and hits its goal, receive the funds securely to start working on your project and fulfilling rewards."
        }
    ];

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <section className="bg-background text-text-primary py-24 relative overflow-hidden border-b border-border-light">
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-[40%] h-[100%] bg-cream opacity-10 blur-[120px] rounded-full"></div>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter uppercase"
                    >
                        How <span className="text-primary underline decoration-primary decoration-4 underline-offset-8">CREATE GOOD</span> Works
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
                        className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto font-bold uppercase tracking-widest leading-relaxed"
                    >
                        From an idea to reality. We provide the space, you provide the vision.
                    </motion.p>
                </div>
            </section>

            {/* Steps Section */}
            <section className="py-24 max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {[
                        {
                            title: "Share Your Vision",
                            description: "Tell your story. Share your vision, set your funding goal, pick a category, and show the world what you're building.",
                            icon: <Target className="text-primary" size={28} />
                        },
                        {
                            title: "Set Your Goals",
                            description: "Plan the rewards. Be clear about what backers will receive and how funds will be used. Transparency builds trust.",
                            icon: <Zap className="text-primary" size={28} />
                        },
                        {
                            title: "Build Your Community",
                            description: "Reach your community. Share your project, engage with supporters, and keep them updated. Connection is everything.",
                            icon: <Users className="text-primary" size={28} />
                        },
                        {
                            title: "Bring It to Life",
                            description: "Launch your dream. When your goal is reached, funds come through so you can start creating and delivering rewards.",
                            icon: <Rocket className="text-primary" size={28} />
                        }
                    ].map((step, index, arr) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                            className="relative group"
                        >
                            <div className="mb-6 w-14 h-14 bg-background border border-border-light rounded-lg flex items-center justify-center transition-all group-hover:bg-cream shadow-sm">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold text-text-primary mb-3 uppercase tracking-tight">{step.title}</h3>
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] leading-relaxed">{step.description}</p>
                            {index < arr.length - 1 && (
                                <div className="hidden lg:block absolute top-6 -right-6 text-gray-200">
                                    <ArrowRight size={20} />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="bg-background py-24 border-y border-border-light">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-20 items-center">
                        <div className="lg:w-1/2">
                            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-4">Integrity</p>
                            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-8 tracking-tighter uppercase leading-tight">
                                Why creators <span className="text-primary">trust</span> us
                            </h2>
                            <div className="space-y-6">
                                {[
                                    "Bank-level security keeps your info safe",
                                    "No surprise fees—complete transparency",
                                    "Tools and insights to help you succeed",
                                    "Support whenever you need it"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="mt-1 bg-white border border-border-light rounded-full p-1 shadow-sm">
                                            <CheckCircle size={14} className="text-primary" />
                                        </div>
                                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest leading-relaxed">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:w-1/2 bg-white p-12 rounded-lg border border-border-light shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-background opacity-50 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2"></div>
                            <div className="relative z-10">
                                <h3 className="text-3xl font-bold text-text-primary mb-4 tracking-tighter uppercase">Ready to get started?</h3>
                                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-10 leading-relaxed">Join thousands of creators who have turned their dreams into reality.</p>
                                <Link to="/create-campaign" className="inline-flex items-center gap-3 bg-primary text-white px-10 py-4 rounded-lg font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all">
                                    Launch Your Idea <ArrowRight size={18} />
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
