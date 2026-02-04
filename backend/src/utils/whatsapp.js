const sendWhatsAppMessage = async (to, message) => {
    console.log(`Sending WhatsApp message to ${to}: ${message}`);
    // Integration with WhatsApp API (e.g., Twilio, WATI) goes here
};

module.exports = { sendWhatsAppMessage };
