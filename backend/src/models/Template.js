const mongoose = require('mongoose');

const templateSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        layoutKey: {
            type: String,
            required: true, // e.g., 'BASIC_TEXT', 'BOLD_RED'
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        content: {
            type: String, // Can be HTML string or JSON structure (Optional, as keys drive frontend)
            required: false,
        },
        previewImage: {
            type: String, // URL to a preview image
            required: false
        },
    },
    {
        timestamps: true,
    }
);

const Template = mongoose.model('Template', templateSchema);

module.exports = Template;
