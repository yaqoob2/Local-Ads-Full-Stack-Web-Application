import React, { useState, useEffect } from 'react';
import { getCards, addCard } from '../../api/payment.api';

const PaymentMethods = () => {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        cardHolderName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        loadCards();
    }, []);

    const loadCards = async () => {
        try {
            const data = await getCards();
            setCards(data);
        } catch (err) {
            console.error('Failed to load cards', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await addCard(formData);
            setFormData({ cardHolderName: '', cardNumber: '', expiryDate: '', cvv: '' });
            setShowForm(false);
            loadCards(); // Refresh list
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add card');
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Payment Methods</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    {showForm ? 'Cancel' : '+ Add New Card'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Add New Card</h2>
                    {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Card Holder Name</label>
                            <input
                                type="text"
                                name="cardHolderName"
                                value={formData.cardHolderName}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                            <input
                                type="text"
                                name="cardNumber"
                                value={formData.cardNumber}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                maxLength="16"
                                placeholder="0000 0000 0000 0000"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (MM/YY)</label>
                                <input
                                    type="text"
                                    name="expiryDate"
                                    value={formData.expiryDate}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="MM/YY"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                                <input
                                    type="password"
                                    name="cvv"
                                    value={formData.cvv}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    maxLength="3"
                                    placeholder="123"
                                    required
                                />
                            </div>
                        </div>
                        <div className="pt-2">
                            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors">
                                Save Card
                            </button>
                        </div>

                    </form>
                </div>
            )}

            {loading ? (
                <div className="text-center py-10">Loading cards...</div>
            ) : cards.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                    {cards.map(card => (
                        <div key={card._id} className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-20 text-6xl font-serif italic">PAY</div>
                            <div className="flex justify-between items-start mb-8">
                                <div className="text-xs uppercase tracking-widest opacity-70">Current Balance</div>
                                <div className="text-xl font-bold tracking-widest">**** {card.cardNumber.slice(-4)}</div>
                            </div>
                            <div className="mb-2">
                                <div className="text-xs uppercase opacity-70 mb-1">Card Holder</div>
                                <div className="font-medium tracking-wide">{card.cardHolderName}</div>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-xs uppercase opacity-70 mb-1">Expires</div>
                                    <div className="font-medium">{card.expiryDate}</div>
                                </div>
                                <div className="text-2xl font-bold italic opacity-90">{card.type}</div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500">No payment methods saved yet.</p>
                </div>
            )}
        </div>
    );
};

export default PaymentMethods;
