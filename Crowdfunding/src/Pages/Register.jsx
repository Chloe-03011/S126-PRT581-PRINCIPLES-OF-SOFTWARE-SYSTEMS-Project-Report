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
            <div className="min-h-[calc(100vh-80px)] bg-custom-white flex items-center justify-center p-8">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-white p-12 rounded-3xl shadow-2xl border-2 border-custom-yellow text-center"
                >
                    <div className="w-20 h-20 bg-custom-yellow/20 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 size={40} className="text-custom-yellow" />
                    </div>
                    <h2 className="text-3xl font-black text-custom-black mb-4">Under Approval</h2>
                    <p className="text-gray-500 font-bold leading-relaxed mb-8">
                        Your registration as a Creator is under approval. Our team will verify your identity documents (NID and Address) to ensure platform safety.
                    </p>
                    <Link to="/" className="inline-block bg-custom-black text-custom-white px-10 py-4 rounded-full font-black hover:bg-gray-900 transition-all">
                        Back to Home
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-80px)] flex">
            {/* Left Side: Dynamic Visual based on Step */}
            <div className="hidden lg:flex w-1/2 bg-custom-black relative overflow-hidden items-center justify-center p-12">
                <div className="absolute inset-0">
                    <div className={`absolute top-0 left-0 w-full h-full opacity-20 transition-all duration-1000 ${step === 1 ? 'bg-grad-blue' : step === 2 ? 'bg-grad-yellow' : 'bg-grad-blue'}`}></div>
                </div>
                
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={step}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="relative z-10 max-w-lg"
                    >
                        {step === 1 && (
                            <>
                                <h1 className="text-6xl font-black text-custom-white leading-tight mb-8">
                                    CHOOSE YOUR <span className="text-custom-blue">PATH</span>.
                                </h1>
                                <p className="text-xl text-gray-400 leading-relaxed">
                                    Whether you're here to back innovation or launch the next big thing, you're in the right place.
                                </p>
                            </>
                        )}
                        {step === 2 && (
                            <>
                                <h1 className="text-6xl font-black text-custom-white leading-tight mb-8">
                                    SECURE YOUR <span className="text-custom-yellow">ACCOUNT</span>.
                                </h1 >
                                <p className="text-xl text-gray-400 leading-relaxed">
                                    We use industry-standard security to keep your information and transactions safe.
                                </p>
                            </>
                        )}
                        {step === 3 && (
                            <>
                                <h1 className="text-6xl font-black text-custom-white leading-tight mb-8">
                                    VERIFY YOUR <span className="text-custom-blue">IDENTITY</span>.
                                </h1>
                                <p className="text-xl text-gray-400 leading-relaxed">
                                    To prevent scams and maintain trust, we require verified information from our creators.
                                </p>
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 bg-custom-white flex items-center justify-center p-8 sm:p-12 overflow-y-auto">
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="mb-8">
                        <div className="flex gap-2 mb-6">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className={`h-1.5 flex-grow rounded-full transition-all duration-500 ${s <= step ? 'bg-custom-yellow' : 'bg-gray-200'}`}></div>
                            ))}
                        </div>
                        <h2 className="text-4xl font-black text-custom-black mb-2">Create Account</h2>
                        <p className="text-gray-500 font-medium">Step {step} of 3</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 font-bold text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div 
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 block mb-4">I want to...</label>
                                    <button 
                                        type="button"
                                        onClick={() => { setRole('backer'); nextStep(); }}
                                        className={`w-full p-6 rounded-2xl border-2 transition-all flex items-center justify-between group ${role === 'backer' ? 'border-custom-yellow bg-custom-yellow/5' : 'border-gray-100 hover:border-gray-200'}`}
                                    >
                                        <div className="text-left">
                                            <p className="font-black text-xl text-custom-black mb-1">Support Projects</p>
                                            <p className="text-sm text-gray-500 font-bold">Discover and back amazing ideas</p>
                                        </div>
                                        <ArrowRight className={`transition-transform ${role === 'backer' ? 'text-custom-yellow translate-x-1' : 'text-gray-300'}`} />
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => { setRole('creator'); nextStep(); }}
                                        className={`w-full p-6 rounded-2xl border-2 transition-all flex items-center justify-between group ${role === 'creator' ? 'border-custom-yellow bg-custom-yellow/5' : 'border-gray-100 hover:border-gray-200'}`}
                                    >
                                        <div className="text-left">
                                            <p className="font-black text-xl text-custom-black mb-1">Raise Funds</p>
                                            <p className="text-sm text-gray-500 font-bold">Bring your creative projects to life</p>
                                        </div>
                                        <ArrowRight className={`transition-transform ${role === 'creator' ? 'text-custom-yellow translate-x-1' : 'text-gray-300'}`} />
                                    </button>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div 
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-5"
                                >
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400">Full Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-custom-yellow transition-colors" size={20} />
                                            <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow focus:bg-white outline-none py-4 pl-12 pr-4 rounded-2xl font-bold transition-all" placeholder="John Doe" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400">Email Address</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-custom-yellow transition-colors" size={20} />
                                            <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow focus:bg-white outline-none py-4 pl-12 pr-4 rounded-2xl font-bold transition-all" placeholder="name@example.com" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400">Phone Number</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-custom-yellow transition-colors" size={20} />
                                            <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow focus:bg-white outline-none py-4 pl-12 pr-4 rounded-2xl font-bold transition-all" placeholder="+880 1XXX-XXXXXX" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400">Password</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-custom-yellow transition-colors" size={20} />
                                            <input type="password" name="password" required value={formData.password} onChange={handleInputChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow focus:bg-white outline-none py-4 pl-12 pr-4 rounded-2xl font-bold transition-all" placeholder="••••••••" />
                                        </div>
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                        <button type="button" onClick={prevStep} className="w-1/3 border-2 border-gray-100 hover:bg-gray-50 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95">
                                            <ArrowLeft size={18} /> Back
                                        </button>
                                        <button type="button" onClick={nextStep} className="flex-grow bg-custom-black text-custom-white py-4 rounded-2xl font-black hover:bg-gray-900 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-black/10">
                                            Next Step <ArrowRight size={18} className="text-custom-yellow" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div 
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-5"
                                >
                                    {/* Photo Upload */}
                                    <div className="flex flex-col items-center mb-6">
                                        <div className="relative group cursor-pointer">
                                            <div className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden border-4 border-white shadow-lg flex items-center justify-center">
                                                {photoPreview ? (
                                                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <Camera size={32} className="text-gray-300" />
                                                )}
                                            </div>
                                            <input type="file" accept="image/*" onChange={handlePhotoChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                            <div className="absolute -bottom-1 -right-1 bg-custom-yellow p-1.5 rounded-full shadow-lg">
                                                <PlusCircle size={16} className="text-custom-black" />
                                            </div>
                                        </div>
                                        <p className="text-xs font-black uppercase tracking-widest text-gray-400 mt-4">Upload Profile Photo</p>
                                    </div>

                                    {role === 'creator' && (
                                        <>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">National ID (NID)</label>
                                                <div className="relative group">
                                                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-custom-yellow transition-colors" size={20} />
                                                    <input type="text" name="nid" required={role === 'creator'} value={formData.nid} onChange={handleInputChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow focus:bg-white outline-none py-4 pl-12 pr-4 rounded-2xl font-bold transition-all" placeholder="XXXX-XXXX-XXXX" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Physical Address</label>
                                                <div className="relative group">
                                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-custom-yellow transition-colors" size={20} />
                                                    <input type="text" name="address" required={role === 'creator'} value={formData.address} onChange={handleInputChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow focus:bg-white outline-none py-4 pl-12 pr-4 rounded-2xl font-bold transition-all" placeholder="House, Road, City" />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                            <Heart size={14} className="text-custom-yellow" />
                                            Project Interests
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {categories.map(cat => (
                                                <button 
                                                    key={cat}
                                                    type="button"
                                                    onClick={() => toggleInterest(cat)}
                                                    className={`px-4 py-2 rounded-full text-xs font-black transition-all border-2 ${formData.interests.includes(cat) ? 'bg-custom-yellow border-custom-yellow text-custom-black' : 'border-gray-100 text-gray-500 hover:border-gray-200'}`}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button type="button" onClick={prevStep} className="w-1/3 border-2 border-gray-100 hover:bg-gray-50 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95">
                                            <ArrowLeft size={18} /> Back
                                        </button>
                                        <button 
                                            disabled={loading}
                                            className="flex-grow bg-custom-black text-custom-white py-4 rounded-2xl font-black hover:bg-gray-900 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-black/10 disabled:opacity-50"
                                        >
                                            {loading ? 'Creating Account...' : 'Complete Sign Up'}
                                            {!loading && <ArrowRight size={18} className="text-custom-yellow" />}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
