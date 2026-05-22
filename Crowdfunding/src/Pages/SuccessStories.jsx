import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote, Heart, Star, TrendingUp, ArrowRight, Rocket, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const SuccessStories = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
            const res = await api.get('/success-stories');
            setStories(res.data);
        } catch (error) {
            console.error('Error fetching stories:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <section className="bg-background text-text-primary py-24 relative overflow-hidden border-b border-border-light">
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-[40%] h-[100%] bg-cream opacity-10 blur-[120px] rounded-full"></div>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="inline-flex items-center gap-2 bg-white border border-border-light px-4 py-2 rounded-full text-primary font-bold text-[10px] uppercase tracking-[0.2em] mb-8 shadow-sm"
                    >
                        <Star size={14} fill="currentColor" /> Community Stories <Star size={14} fill="currentColor" />
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter uppercase"
                    >
                        Impact <span className="text-primary underline decoration-primary decoration-4 underline-offset-8">Stories</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
                        className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto font-bold uppercase tracking-widest leading-relaxed"
                    >
                        Real people, real change. See how communities are creating good together.
                    </motion.p>
                </div>
            </section>

            {/* Stories Grid */}
            <section className="py-24 max-w-7xl mx-auto px-4 min-h-[400px]">
                {loading ? (
                    <div className="flex items-center justify-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : stories.length > 0 ? (
                    <div className="space-y-32">
                        {stories.map((story, index) => (
                            <motion.div 
                                key={story._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-20 items-center`}
                            >
                                <div className="lg:w-1/2 relative group w-full">
                                    <div className="absolute -inset-2 bg-background rounded-lg border border-border-light transition-all group-hover:bg-cream"></div>
                                    <img 
                                        src={story.image} 
                                        alt={story.title} 
                                        className="relative rounded-lg w-full h-[450px] object-cover border border-border-light shadow-sm transition-all duration-700"
                                    />
                                    <div className="absolute bottom-6 left-6 right-6 flex gap-4">
                                        <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-lg flex-1 border border-border-light shadow-sm">
                                            <p className="text-primary font-bold text-2xl tracking-tight">{story.raised}</p>
                                            <p className="text-gray-400 text-[8px] font-bold uppercase tracking-[0.2em]">Raised</p>
                                        </div>
                                        <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-lg flex-1 border border-border-light shadow-sm">
                                            <p className="text-text-primary font-bold text-2xl tracking-tight">{story.backers}</p>
                                            <p className="text-gray-400 text-[8px] font-bold uppercase tracking-[0.2em]">Supporters</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="lg:w-1/2 space-y-8">
                                    <div className="inline-block bg-background border border-border-light px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary shadow-sm">
                                        {story.category}
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-bold text-text-primary tracking-tighter uppercase leading-tight">
                                        {story.title}
                                    </h2>
                                    <div className="relative">
                                        <Quote className="absolute -left-6 -top-6 w-12 h-12 text-background" />
                                        <p className="text-lg font-bold text-gray-500 leading-relaxed italic relative z-10 uppercase tracking-wide">
                                            "{story.quote}"
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4 pt-4 border-t border-border-light w-fit">
                                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm uppercase">
                                            {story.author.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-text-primary uppercase tracking-widest">{story.author}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{story.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-40">
                        <div className="w-20 h-20 bg-background border border-border-light rounded-lg flex items-center justify-center mx-auto mb-6 text-gray-200">
                            <Rocket size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-text-primary mb-2 uppercase tracking-tighter">Be inspired. Your story could be next.</h3>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Be the first to change the world and join our success stories.</p>
                        <Link to="/create-campaign" className="mt-8 text-primary font-bold uppercase text-[10px] tracking-[0.2em] hover:underline inline-block">
                            Start your journey
                        </Link>
                    </div>
                )}
            </section>

            {/* CTA Section */}
            <section className="bg-background py-24 text-center overflow-hidden relative border-y border-border-light">
                <div className="max-w-4xl mx-auto px-4 relative z-10">
                    <h2 className="text-5xl md:text-7xl font-bold text-text-primary mb-8 tracking-tighter uppercase leading-none">
                        Ready to share your <span className="text-primary underline decoration-primary decoration-4 underline-offset-8">story</span>?
                    </h2>
                    <p className="text-lg font-bold text-gray-500 uppercase tracking-widest mb-12 max-w-2xl mx-auto leading-relaxed">
                        Have an idea? Start your project and join our community of creators and supporters.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/create-campaign" className="bg-primary text-white px-10 py-4 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center gap-3 hover:opacity-90 transition-all shadow-sm">
                            Start Your Journey <Rocket size={18} />
                        </Link>
                        <Link to="/explore" className="bg-white border border-border-light text-text-primary px-10 py-4 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-background transition-all shadow-sm">
                            Explore Projects <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SuccessStories;
