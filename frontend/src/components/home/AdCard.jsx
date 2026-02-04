import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { trackAdClick } from '../../api/ads.api';
import TemplateClean from '../ads/templates/TemplateClean';

const AdCard = ({ ad }) => {

    const handleWhatsAppClick = async (e) => {
        // ... (rest of logic same)
        try {
            await trackAdClick(ad._id, 'whatsapp');
        } catch (err) {
            console.error('Tracking failed', err);
        }
    };

    // Helper to map DB match to Template Component
    const getTemplateComponent = (templateName) => {
        return TemplateClean;
    };

    const TemplateComponent = getTemplateComponent(ad.template);

    // Map AD DB Object to Template Props
    const templateProps = {
        headline: ad.content?.title || ad.headline,
        subtext: ad.content?.subtext || ad.subtext,
        description: ad.content?.description || ad.description,

        // Handle Category: Could be object (DB) or string (Form Preview)
        category: ad.category?.name || ad.category || "Service",

        // Handle Location: Could be nested (DB) or flat (Form Preview)
        area: ad.location?.area || ad.area,
        pincode: ad.location?.pincode || ad.pincode,

        whatsappNumber: ad.content?.contactPhone || ad.whatsapp || "919999999999",
        isSponsored: Math.random() < 0.3,
        planLevel: "BASIC"
    };

    return (
        <Link to={`/ads/${ad._id}`} className="block h-full group" onClick={() => trackAdClick(ad._id, 'view')}>
            <motion.div
                className="h-full"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                <TemplateComponent {...templateProps} onWhatsAppClick={handleWhatsAppClick} />
            </motion.div>
        </Link>
    );
};

export default AdCard;
