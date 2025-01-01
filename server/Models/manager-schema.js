import mongoose from "mongoose";

const managerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    assignedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export const Manager = mongoose.models.Manager || mongoose.model('Manager', managerSchema);
