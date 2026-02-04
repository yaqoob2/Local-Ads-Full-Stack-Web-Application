import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCards, addCard } from '../../api/payment.api';
import { createSubscription } from '../../api/subscription.api';

// Hardcoded plans matching Pricing.jsx
const PLANS = [
    { _id: 'starter', name: 'Starter', price: 0, duration: 'Forever' },
    { _id: 'growth', name: 'Growth', price: 30, duration: 'Monthly' },
    { _id: 'business', name: 'Business', price: 100, duration: 'Monthly' }
];

const Checkout = () => {
    const { planId } = useParams();
    const navigate = useNavigate();

    const [plan, setPlan] = useState(null);
    const [cards, setCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [showAddCard, setShowAddCard] = useState(false);

    // New Card Form State
    const [newCardData, setNewCardData] = useState({
        cardHolderName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });

    useEffect(() => {
        const foundPlan = PLANS.find(p => p._id === planId);
        if (!foundPlan) {
            alert('Invalid Plan');
            navigate('/pricing');
            return;
        }
        setPlan(foundPlan);
        loadCards();
    }, [planId, navigate]);

    const loadCards = async () => {
        try {
            const data = await getCards();
            setCards(data);
            if (data.length > 0) setSelectedCard(data[0]._id);
        } catch (err) {
            console.error('Failed to load cards', err);
        } finally {
            setLoading(false);
        }
    };

    const handleNewCardChange = (e) => {
        setNewCardData({ ...newCardData, [e.target.name]: e.target.value });
    };

    const handleAddNewCard = async (e) => {
        e.preventDefault();
        try {
            const addedCard = await addCard(newCardData);
            setCards([addedCard, ...cards]);
            setSelectedCard(addedCard._id);
            setShowAddCard(false);
            setNewCardData({ cardHolderName: '', cardNumber: '', expiryDate: '', cvv: '' });
        } catch (err) {
            alert('Failed to add card: ' + (err.response?.data?.message || err.message));
        }
    };

    const handlePayment = async () => {
        if (!selectedCard && plan.price > 0) {
            alert('Please select a payment method');
            return;
        }

        setProcessing(true);
        try {
            // In a real app, we would pass cardId to the backend
            // await createSubscription(planId, selectedCard);

            // For this demo, we just create the subscription as before
            await createSubscription(planId);

            alert(`Successfully subscribed to ${plan.name} Plan!`);
            navigate('/advertiser/dashboard');
        } catch (err) {
            console.error(err);
            alert('Payment Failed: ' + (err.response?.data?.message || 'Unknown error'));
        } finally {
            setProcessing(false);
        }
    };

    if (loading || !plan) return <div className="p-20 text-center">Loading...</div>;

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Order Summary */}
                <div>
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-24">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h2>
                        <div className="flex justify-between items-center py-4 border-b border-gray-100">
                            <div>
                                <h3 className="font-bold text-lg">{plan.name} Plan</h3>
                                <p className="text-sm text-gray-500">Duration: {plan.duration}</p>
                            </div>
                            <div className="text-xl font-bold">₹{plan.price}</div>
                        </div>
                        <div className="flex justify-between items-center py-4 text-lg font-bold">
                            <span>Total</span>
                            <span>₹{plan.price}</span>
                        </div>
                    </div>
                </div>

                {/* Payment Section */}
                <div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-xl font-semibold mb-6">Payment Method</h2>

                        {/* Saved Cards List */}
                        <div className="space-y-4 mb-6">
                            {cards.map(card => (
                                <div
                                    key={card._id}
                                    onClick={() => setSelectedCard(card._id)}
                                    className={`p-4 rounded-lg border-2 cursor-pointer flex items-center justify-between transition-all ${selectedCard === card._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedCard === card._id ? 'border-blue-600' : 'border-gray-400'}`}>
                                            {selectedCard === card._id && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">**** {card.cardNumber.slice(-4)}</p>
                                            <p className="text-xs text-gray-500">Expires {card.expiryDate}</p>
                                        </div>
                                    </div>
                                    <span className="font-mono font-bold text-gray-400">{card.type}</span>
                                </div>
                            ))}

                            {cards.length === 0 && !showAddCard && (
                                <p className="text-gray-500/70 text-center py-4">No saved cards found.</p>
                            )}
                        </div>

                        {/* Add New Card Toggle */}
                        {!showAddCard ? (
                            <button
                                onClick={() => setShowAddCard(true)}
                                className="text-blue-600 font-semibold hover:underline flex items-center gap-2 mb-6"
                            >
                                + Add New Card
                            </button>
                        ) : (
                            <form onSubmit={handleAddNewCard} className="bg-gray-50 p-4 rounded-lg mb-6 animate-fade-in">
                                <h3 className="font-bold text-sm mb-3">New Card Details</h3>
                                <div className="space-y-3">
                                    <input
                                        name="cardHolderName"
                                        placeholder="Card Holder Name"
                                        value={newCardData.cardHolderName}
                                        onChange={handleNewCardChange}
                                        className="w-full p-2 border rounded text-sm"
                                        required
                                    />
                                    <input
                                        name="cardNumber"
                                        placeholder="Card Number"
                                        value={newCardData.cardNumber}
                                        onChange={handleNewCardChange}
                                        className="w-full p-2 border rounded text-sm"
                                        maxLength="16"
                                        required
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            name="expiryDate"
                                            placeholder="MM/YY"
                                            value={newCardData.expiryDate}
                                            onChange={handleNewCardChange}
                                            className="w-full p-2 border rounded text-sm"
                                            required
                                        />
                                        <input
                                            name="cvv"
                                            type="password"
                                            placeholder="CVV"
                                            value={newCardData.cvv}
                                            onChange={handleNewCardChange}
                                            className="w-full p-2 border rounded text-sm"
                                            maxLength="4"
                                            required
                                        />
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <button type="submit" className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium">Save</button>
                                        <button type="button" onClick={() => setShowAddCard(false)} className="text-gray-500 px-3 py-1.5 text-sm">Cancel</button>
                                    </div>
                                </div>
                            </form>
                        )}

                        <button
                            onClick={handlePayment}
                            disabled={processing}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Processing Payment...' : `Pay ₹${plan.price} & Subscribe`}
                        </button>
                        <p className="text-center text-xs text-gray-400 mt-4">
                            Secure Payment via LocalAds Demo Gateway
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
