import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdCard from '../../components/home/AdCard';
import { getCategories, getTemplates } from '../../api/meta.api';
import { createAd } from '../../api/ads.api';
import { getLocationByPincode } from '../../api/location.api';

const CreateAd = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [step, setStep] = useState(1);

    // Check if we are in edit mode
    const isEditMode = location.state?.edit;
    const initialData = location.state?.adData || {
        headline: '',
        subtext: '',
        description: '',
        category: '',   // Will store category name or ID depending on how we set up
        categoryId: '', // Explicit ID for backend
        template: '',   // Will store template ID
        city: '',
        area: '',
        pincode: '',
        whatsapp: '',
    };

    const [formData, setFormData] = useState(initialData);
    const [categories, setCategories] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pincodeSuggestions, setPincodeSuggestions] = useState(null);
    const [toast, setToast] = useState({ message: '', type: '' });

    const showToast = (message, type = 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast({ message: '', type: '' }), 5000); // 5 seconds visibility
    };

    // Initial Data Fetch
    useEffect(() => {
        const fetchMeta = async () => {
            try {
                const [cats, tmpls] = await Promise.all([
                    getCategories(),
                    getTemplates()
                ]);
                setCategories(cats);
                setTemplates(tmpls);
            } catch (err) {
                console.error('Failed to load metadata', err);
                setError('Failed to load form options. Please try refreshing.');
            } finally {
                setLoading(false);
            }
        };
        fetchMeta();
    }, []);

    // Pincode Lookup Handler
    const handlePincodeChange = async (e) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, pincode: value }));

        if (value.length === 6) {
            try {
                // Returns object or array of location data
                const data = await getLocationByPincode(value);
                if (data) {
                    // Auto-fill if single result, or just simple mapping for now
                    // Assuming backend returns { city: 'Mumbai', area: 'Andheri', ... }
                    setFormData(prev => ({
                        ...prev,
                        city: data.city || prev.city,
                        area: data.area || prev.area
                    }));
                }
            } catch (err) {
                console.warn('Pincode lookup failed', err);
            }
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNext = () => {
        if (step === 3) {
            if (!formData.headline || !formData.subtext || !formData.description || !formData.pincode || !formData.city || !formData.area || !formData.whatsapp) {
                setError('Please fill in all required fields.');
                return;
            }
        }
        setError('');
        setStep((prev) => Math.min(prev + 1, 4));
    };
    const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

    const handleSubmit = async () => {
        try {
            // Prepare payload
            // Prepare payload matching backend schema
            const payload = {
                category: formData.categoryId,
                template: formData.template,
                content: {
                    title: formData.headline,
                    subtext: formData.subtext,
                    description: formData.description,
                    contactPhone: formData.whatsapp
                },
                location: {
                    city: formData.city,
                    area: formData.area,
                    pincode: formData.pincode
                }
            };

            await createAd(payload);
            navigate('/advertiser/dashboard');
        } catch (err) {
            console.error('Submission failed', err);
            // Handle specific limit error
            if (err.response && err.response.status === 400) {
                showToast(err.response.data.message || 'Limit reached', 'error');
            } else {
                setError('Failed to publish ad. Please check all fields.');
            }
        }
    };

    const renderProgressBar = () => (
        <div className="flex items-center justify-center mb-8">
            {[1, 2, 3, 4].map((i) => (
                <React.Fragment key={i}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${step >= i ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                        {i}
                    </div>
                    {i < 4 && <div className={`w-12 h-1 ${step > i ? 'bg-blue-600' : 'bg-gray-200'}`} />}
                </React.Fragment>
            ))}
        </div>
    );

    const handleDeleteAndRecreate = async () => {
        if (!initialData._id) return;
        if (window.confirm('This will delete the existing ad and start a new one with the same details. Continue?')) {
            try {
                await deleteAd(initialData._id);
            } catch (err) {
                console.error('Delete failed', err);
                // Proceed anyway so user can recreate
            }
            setIsEditMode(false);
            // Form data is already pre-filled from initialData, so we just let them continue as new
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    // Special View for Edit Mode (since backend doesn't support update)
    if (isEditMode) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-8">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-8 rounded-r-lg shadow-sm">
                    <div className="flex items-center mb-4">
                        <svg className="w-8 h-8 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <h2 className="text-2xl font-bold text-yellow-800">Editing Not Supported Yet</h2>
                    </div>
                    <p className="text-yellow-700 mb-6 text-lg">
                        Direct updates are currently disabled. To make changes, please delete this ad and create a new version.
                    </p>

                    <div className="bg-white p-4 rounded-lg mb-8 border border-yellow-200">
                        <h3 className="font-bold text-gray-900 mb-1">Ad: {initialData.headline}</h3>
                        <p className="text-sm text-gray-500">Posted: {initialData.createdAt ? new Date(initialData.createdAt).toLocaleDateString() : 'N/A'}</p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/advertiser/my-ads')}
                            className="bg-white hover:bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium border border-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteAndRecreate}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-bold shadow-md transition-colors flex-1"
                        >
                            Delete & Re-create New
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            {/* Toast Notification */}
            {toast.message && (
                <div className={`fixed top-24 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl text-white font-bold text-sm transition-all animate-bounce ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
                    {toast.message}
                </div>
            )}
            {renderProgressBar()}

            <h1 className="text-2xl font-bold text-center mb-8 text-gray-900">
                {step === 1 && 'Select a Category'}
                {step === 2 && 'Choose a Template'}
                {step === 3 && 'Ad Details'}
                {step === 4 && 'Preview & Publish'}
            </h1>

            {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-center">{error}</div>}

            {/* Step 1: Category Selection */}
            {step === 1 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[...categories].sort((a, b) => a.name.localeCompare(b.name)).map((cat) => (
                        <button
                            key={cat._id}
                            onClick={() => {
                                setFormData({
                                    ...formData,
                                    category: cat.name,
                                    categoryId: cat._id
                                });
                                handleNext();
                            }}
                            className={`p-6 rounded-xl border-2 hover:border-blue-500 transition-all flex flex-col items-center gap-2 ${formData.categoryId === cat._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
                        >
                            <span className="text-4xl">{cat.icon || '📦'}</span>
                            <span className="font-medium text-gray-700">{cat.name}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* Step 2: Template Selection */}
            {step === 2 && (
                <div className="space-y-4">
                    {templates.map((tmpl) => (
                        <button
                            key={tmpl._id} // Assuming backend returns _id
                            onClick={() => {
                                setFormData({ ...formData, template: tmpl.layoutKey || tmpl._id }); // Flexible template ID usage
                                handleNext();
                            }}
                            className={`w-full p-6 text-left rounded-xl border-2 transition-all flex items-center justify-between group ${formData.template === (tmpl.layoutKey || tmpl._id) ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                            <div>
                                <h3 className="font-bold text-lg mb-1">{tmpl.name}</h3>
                                <p className="text-sm text-gray-500">{tmpl.description || 'Optimized styling for your ad.'}</p>
                            </div>
                            {/* Simple visual indicator of template style */}
                            <div className={`w-12 h-12 rounded-full border border-gray-100 ${tmpl.layoutKey === 'urgent' ? 'bg-red-50' : tmpl.layoutKey === 'eco' ? 'bg-green-50' : 'bg-blue-50'}`}></div>
                        </button>
                    ))}
                    <div className="flex justify-start mt-6">
                        <button onClick={handleBack} className="text-gray-500 underline">Back</button>
                    </div>
                </div>
            )}

            {/* Step 3: Form Details */}
            {step === 3 && (
                <div className="space-y-6">
                    <div className="relative">
                        <input
                            type="text"
                            name="headline"
                            value={formData.headline}
                            onChange={handleChange}
                            required
                            className="peer w-full h-12 border-b-2 border-gray-300 focus:border-blue-600 focus:outline-none placeholder-transparent"
                            placeholder="Headline"
                        />
                        <label className={`absolute left-0 transition-all pointer-events-none ${formData.headline ? '-top-3.5 text-gray-600 text-sm' : '-top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm'}`}>
                            Ad Headline (e.g., Expert Plumber)
                        </label>
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            name="subtext"
                            value={formData.subtext}
                            onChange={handleChange}
                            required
                            className="peer w-full h-12 border-b-2 border-gray-300 focus:border-blue-600 focus:outline-none placeholder-transparent"
                            placeholder="Subtext"
                        />
                        <label className={`absolute left-0 transition-all pointer-events-none ${formData.subtext ? '-top-3.5 text-gray-600 text-sm' : '-top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm'}`}>
                            Short Subtext
                        </label>
                    </div>

                    <div className="relative">
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            className="peer w-full h-24 border-b-2 border-gray-300 focus:border-blue-600 focus:outline-none placeholder-transparent resize-none py-2"
                            placeholder="Description"
                        />
                        <label className={`absolute left-0 transition-all pointer-events-none ${formData.description ? '-top-3.5 text-gray-600 text-sm' : '-top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm'}`}>
                            Full Description
                        </label>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="relative">
                            <input
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handlePincodeChange}
                                maxLength={6}
                                required
                                className="peer w-full h-12 border-b-2 border-gray-300 focus:border-blue-600 focus:outline-none placeholder-transparent"
                                placeholder="Pincode"
                            />
                            <label className={`absolute left-0 transition-all pointer-events-none ${formData.pincode ? '-top-3.5 text-gray-600 text-sm' : '-top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm'}`}>
                                Pincode {formData.pincode.length === 6 && '✅'}
                            </label>
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                                className="peer w-full h-12 border-b-2 border-gray-300 focus:border-blue-600 focus:outline-none placeholder-transparent"
                                placeholder="City"
                            />
                            <label className={`absolute left-0 transition-all pointer-events-none ${formData.city ? '-top-3.5 text-gray-600 text-sm' : '-top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm'}`}>
                                City
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="relative">
                            <input
                                type="text"
                                name="area"
                                value={formData.area}
                                onChange={handleChange}
                                required
                                className="peer w-full h-12 border-b-2 border-gray-300 focus:border-blue-600 focus:outline-none placeholder-transparent"
                                placeholder="Area"
                            />
                            <label className={`absolute left-0 transition-all pointer-events-none ${formData.area ? '-top-3.5 text-gray-600 text-sm' : '-top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm'}`}>
                                Area
                            </label>
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                name="whatsapp"
                                value={formData.whatsapp}
                                onChange={handleChange}
                                required
                                className="peer w-full h-12 border-b-2 border-gray-300 focus:border-blue-600 focus:outline-none placeholder-transparent"
                                placeholder="WhatsApp"
                            />
                            <label className={`absolute left-0 transition-all pointer-events-none ${formData.whatsapp ? '-top-3.5 text-gray-600 text-sm' : '-top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm'}`}>
                                WhatsApp Number
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-between pt-6">
                        <button onClick={handleBack} className="text-gray-500 font-medium">Back</button>
                        <button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold shadow-lg transition-all">Next Step</button>
                    </div>
                </div>
            )}

            {/* Step 4: Preview */}
            {step === 4 && (
                <div className="space-y-8">
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <p className="text-center text-gray-500 mb-4 text-sm font-medium uppercase tracking-wide">Preview Ad Card</p>
                        <div className="max-w-xs mx-auto pointer-events-none">
                            {/* Mock ID for preview */}
                            <AdCard ad={{ _id: 'preview', ...formData }} />
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <button onClick={handleBack} className="text-gray-500 font-medium">Back to Edit</button>
                        <button
                            onClick={handleSubmit}
                            className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-xl shadow-green-200 transition-all transform hover:-translate-y-1"
                        >
                            {isEditMode ? 'Update Ad' : 'Publish Ad Now'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateAd;
