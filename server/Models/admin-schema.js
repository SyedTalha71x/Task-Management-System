import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    adminId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
}, { timestamps: true });

export const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
