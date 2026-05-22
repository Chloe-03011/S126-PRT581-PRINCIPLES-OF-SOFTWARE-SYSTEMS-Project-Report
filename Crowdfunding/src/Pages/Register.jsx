import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import { User, Mail, Lock, ArrowRight, ArrowLeft, Phone, CreditCard, MapPin, Camera, Heart, CheckCircle2, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Register = () => {
    const [step, setStep] = useState(1);
    const [role, setRole] = useState('backer');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        nid: '',
        address: '',
        interests: []
    });
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    const { register } = useAuth();
    const navigate = useNavigate();

    const categories = ['Technology', 'Charity', 'Arts', 'Games', 'Design', 'Environment', 'Food', 'Community'];

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => setPhotoPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const toggleInterest = (category) => {
        const newInterests = formData.interests.includes(category)
            ? formData.interests.filter(i => i !== category)
            : [...formData.interests, category];
        setFormData({ ...formData, interests: newInterests });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'interests') {
                    data.append(key, JSON.stringify(formData[key]));
                } else {
                    data.append(key, formData[key]);
                }
            });
            data.append('role', role);
            if (photo) data.append('profilePicture', photo);

            const result = await register(data);
            
            if (result.status === 'pending') {
                setIsSuccess(true);
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register');
            // If the error message indicates a verification check, keep it on screen
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4">
                {/* Background Blobs */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary rounded-full blur-3xl opacity-20" />
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-light-blue rounded-full blur-3xl opacity-20" />
                </div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-xl w-full bg-white/70 backdrop-blur-2xl p-8 lg:p-12 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/40 text-center relative z-10"
                >
                    <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-12">
                        <CheckCircle2 size={48} className="text-primary -rotate-12" />
                    </div>
                    <h2 className="text-4xl font-bold text-text-primary mb-4">Registration Received!</h2>
                    <div className="space-y-4 mb-10">
                        <p className="text-gray-500 font-medium text-lg leading-relaxed">
                            Your application as a <span className="text-primary font-bold">Creator</span> is now being reviewed by our trust and safety team.
                        </p>
                        <p className="text-gray-400 text-sm">
                            We'll verify your NID and address documents to ensure a safe environment for all backers. This usually takes 24-48 hours.
                        </p>
                    </div>
                    <Link to="/" className="inline-flex items-center gap-3 bg-text-primary text-white px-10 py-5 rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-text-primary/10 active:scale-95">
                        <ArrowLeft size={20} /> Back to Home
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4 sm:p-6 lg:p-8">
            {/* Dynamic Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        x: [0, 100, 0],
                        y: [0, 50, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className={`absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-20 transition-colors duration-1000 ${step === 1 ? 'bg-primary' : step === 2 ? 'bg-light-blue' : 'bg-cream'}`}
                />
                <motion.div 
                    animate={{ 
                        scale: [1, 1.3, 1],
                        rotate: [0, -90, 0],
                        x: [0, -100, 0],
                        y: [0, -50, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className={`absolute -bottom-24 -right-24 w-[30rem] h-[30rem] rounded-full blur-3xl opacity-20 transition-colors duration-1000 ${step === 1 ? 'bg-light-blue' : step === 2 ? 'bg-cream' : 'bg-primary'}`}
                />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-5xl bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/40 overflow-hidden flex flex-col lg:flex-row relative z-10"
            >
                {/* Left Info Panel (Dynamic) */}
                <div className="w-full lg:w-5/12 bg-text-primary p-8 lg:p-12 flex flex-col justify-between text-white relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
                    </div>

                    <div className="relative z-10">
                        <Link to="/" className="inline-flex items-center gap-2 group mb-12">
                            <div className="w-10 h-10 bg-primary rotate-45 rounded-xl flex items-center justify-center group-hover:rotate-90 transition-all duration-500">
                                <span className="text-white font-black text-xl -rotate-45 group-hover:-rotate-90 transition-all duration-500">C</span>
                            </div>
                            <span className="font-black text-xl tracking-tighter">Create<span className="text-primary">Good</span></span>
                        </Link>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.4 }}
                            >
                                <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                                    {step === 1 && <>Choose your <span className="text-primary">path</span></>}
                                    {step === 2 && <>Your basic <span className="text-primary">details</span></>}
                                    {step === 3 && <>Finalize your <span className="text-primary">profile</span></>}
                                </h2>
                                <p className="text-gray-400 text-lg leading-relaxed">
                                    {step === 1 && "Select how you'd like to participate in our community of creators and backers."}
                                    {step === 2 && "Tell us who you are so we can personalize your crowdfunding experience."}
                                    {step === 3 && "Complete your profile to build trust and start making an impact today."}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="relative z-10 pt-8">
                        <div className="flex gap-3 mb-4">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${s <= step ? 'w-8 bg-primary' : 'w-4 bg-white/20'}`}></div>
                            ))}
                        </div>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Step {step} of 3</p>
                    </div>
                </div>

                {/* Right Form Panel */}
                <div className="w-full lg:w-7/12 p-8 lg:p-16 bg-white/40">
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl font-medium text-sm flex items-center gap-3"
                        >
                            <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center flex-shrink-0 text-[10px] font-bold">!</div>
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="h-full flex flex-col">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div 
                                    key="step1"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6"
                                >
                                    <div className="grid gap-4">
                                        <button 
                                            type="button"
                                            onClick={() => { setRole('backer'); nextStep(); }}
                                            className={`group p-6 rounded-[2rem] border-2 transition-all text-left flex items-start gap-6 hover:shadow-xl hover:shadow-primary/5 active:scale-[0.98] ${role === 'backer' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-primary/30 bg-white/50'}`}
                                        >
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${role === 'backer' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-primary/20 group-hover:text-primary'}`}>
                                                <Heart size={28} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-xl text-text-primary mb-1">Support Projects</h3>
                                                <p className="text-gray-500 text-sm leading-relaxed">Join as a Backer to discover and support creative ideas that matter to you.</p>
                                            </div>
                                            <ArrowRight className={`ml-auto self-center transition-transform ${role === 'backer' ? 'text-primary translate-x-1' : 'text-gray-300'}`} />
                                        </button>

                                        <button 
                                            type="button"
                                            onClick={() => { setRole('creator'); nextStep(); }}
                                            className={`group p-6 rounded-[2rem] border-2 transition-all text-left flex items-start gap-6 hover:shadow-xl hover:shadow-primary/5 active:scale-[0.98] ${role === 'creator' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-primary/30 bg-white/50'}`}
                                        >
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${role === 'creator' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-primary/20 group-hover:text-primary'}`}>
                                                <PlusCircle size={28} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-xl text-text-primary mb-1">Raise Funds</h3>
                                                <p className="text-gray-500 text-sm leading-relaxed">Join as a Creator to launch your own campaigns and bring your vision to life.</p>
                                            </div>
                                            <ArrowRight className={`ml-auto self-center transition-transform ${role === 'creator' ? 'text-primary translate-x-1' : 'text-gray-300'}`} />
                                        </button>
                                    </div>
                                    <p className="text-center text-sm text-gray-500 font-medium">
                                        Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Log in</Link>
                                    </p>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div 
                                    key="step2"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                                                <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full bg-white/50 border-2 border-gray-100 focus:border-primary focus:bg-white outline-none py-4 pl-12 pr-4 rounded-2xl font-semibold transition-all placeholder:text-gray-300" placeholder="John Doe" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Phone Number</label>
                                            <div className="relative group">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                                                <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full bg-white/50 border-2 border-gray-100 focus:border-primary focus:bg-white outline-none py-4 pl-12 pr-4 rounded-2xl font-semibold transition-all placeholder:text-gray-300" placeholder="+880 1XXX-XXXXXX" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                                            <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full bg-white/50 border-2 border-gray-100 focus:border-primary focus:bg-white outline-none py-4 pl-12 pr-4 rounded-2xl font-semibold transition-all placeholder:text-gray-300" placeholder="name@example.com" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Password</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                                            <input type="password" name="password" required value={formData.password} onChange={handleInputChange} className="w-full bg-white/50 border-2 border-gray-100 focus:border-primary focus:bg-white outline-none py-4 pl-12 pr-4 rounded-2xl font-semibold transition-all placeholder:text-gray-300" placeholder="••••••••" />
                                        </div>
                                    </div>
                                    <div className="flex gap-4 pt-6 mt-auto">
                                        <button type="button" onClick={prevStep} className="w-1/4 h-14 border-2 border-gray-100 hover:bg-gray-50 rounded-2xl font-bold flex items-center justify-center transition-all active:scale-95 group">
                                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                                        </button>
                                        <button type="button" onClick={nextStep} className="flex-grow h-14 bg-text-primary text-white rounded-2xl font-bold hover:bg-black flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-text-primary/10">
                                            Continue <ArrowRight size={20} className="text-primary" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div 
                                    key="step3"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar"
                                >
                                    {/* Photo Upload */}
                                    <div className="flex items-center gap-6 p-4 bg-primary/5 rounded-3xl border border-primary/10">
                                        <div className="relative group cursor-pointer flex-shrink-0">
                                            <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden border-2 border-primary/20 flex items-center justify-center shadow-sm">
                                                {photoPreview ? (
                                                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <Camera size={28} className="text-primary/30" />
                                                )}
                                            </div>
                                            <input type="file" accept="image/*" onChange={handlePhotoChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                            <div className="absolute -bottom-2 -right-2 bg-primary text-white p-1.5 rounded-lg shadow-lg">
                                                <PlusCircle size={14} />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-text-primary">Profile Picture</h4>
                                            <p className="text-xs text-gray-500 font-medium">Recommended: Square image, max 2MB</p>
                                        </div>
                                    </div>

                                    {role === 'creator' && (
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">National ID (NID)</label>
                                                <div className="relative group">
                                                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                                                    <input type="text" name="nid" required={role === 'creator'} value={formData.nid} onChange={handleInputChange} className="w-full bg-white/50 border-2 border-gray-100 focus:border-primary focus:bg-white outline-none py-4 pl-12 pr-4 rounded-2xl font-semibold transition-all placeholder:text-gray-300" placeholder="XXXX-XXXX-XXXX" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Physical Address</label>
                                                <div className="relative group">
                                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                                                    <input type="text" name="address" required={role === 'creator'} value={formData.address} onChange={handleInputChange} className="w-full bg-white/50 border-2 border-gray-100 focus:border-primary focus:bg-white outline-none py-4 pl-12 pr-4 rounded-2xl font-semibold transition-all placeholder:text-gray-300" placeholder="House, Road, City" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2">
                                            <Heart size={14} className="text-primary fill-primary/20" />
                                            Select Interests
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {categories.map(cat => (
                                                <button 
                                                    key={cat}
                                                    type="button"
                                                    onClick={() => toggleInterest(cat)}
                                                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border-2 ${formData.interests.includes(cat) ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'border-gray-100 text-gray-500 hover:border-primary/30 hover:text-primary bg-white/50'}`}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-6 mt-auto">
                                        <button type="button" onClick={prevStep} className="w-1/4 h-14 border-2 border-gray-100 hover:bg-gray-50 rounded-2xl font-bold flex items-center justify-center transition-all active:scale-95 group">
                                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                                        </button>
                                        <button 
                                            disabled={loading}
                                            className="flex-grow h-14 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-primary/20 disabled:opacity-50"
                                        >
                                            {loading ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    Creating...
                                                </div>
                                            ) : (
                                                <>Complete Registration <CheckCircle2 size={20} /></>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
