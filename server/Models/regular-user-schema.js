import mongoose from "mongoose";

const regularUserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    regularUserId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
}, { timestamps: true });

export const RegularUser = mongoose.models.RegularUser || mongoose.model('RegularUser', regularUserSchema);

