import React from 'react';

const Contact = () => {
    return (
        <div className="max-w-xl mx-auto px-4 py-16">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
                <p className="text-gray-600">Have questions? We'd love to hear from you.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="John Doe" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="john@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none" placeholder="How can we help you?" />
                    </div>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors">
                        Send Message
                    </button>
                    <p className="text-xs text-center text-gray-400 mt-4">
                        (This is a demo form. No email will be sent.)
                    </p>
                </form>
            </div>

            <div className="mt-10 text-center text-gray-600">
                <p className="font-medium">Or reach us directly at:</p>
                <a href="mailto:support@localads.com" className="text-blue-600 hover:underline">support@localads.com</a>
            </div>
        </div>
    );
};

export default Contact;
