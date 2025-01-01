import mongoose from "mongoose";

const managerUserAssignmentSchema = new mongoose.Schema({
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  
        required: true
    },
    userIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  
        required: true
    }]
}, { timestamps: true });

const ManagerUserAssignment = mongoose.model("ManagerUserAssignment", managerUserAssignmentSchema);

export default ManagerUserAssignment;
