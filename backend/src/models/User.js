const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true, lowercase: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        phone: { type: String, required: true, unique: true, trim: true },
        password: { type: String, required: true }, // Changed from passwordHash to password to match auth controller

        role: { type: String, enum: ["USER", "ADVERTISER", "ADMIN"], default: "ADVERTISER" },
        status: { type: String, enum: ["ACTIVE", "BANNED"], default: "ACTIVE" },

        profile: {
            fullName: { type: String, trim: true },
            businessName: { type: String, trim: true },
            state: { type: String, trim: true },
            city: { type: String, trim: true },
            area: { type: String, trim: true },
            pincode: { type: String, trim: true }
        },

        lastLoginAt: { type: Date }
    },
    { timestamps: true }
);

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("User", UserSchema);
