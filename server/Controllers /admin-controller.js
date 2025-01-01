import { SuccessResponse, FailureResponse } from "../Helper/helper.js";
import bcrypt from 'bcrypt'
import { Admin } from "../Models/admin-schema.js";
import { Manager } from "../Models/manager-schema.js";
import { RegularUser } from "../Models/regular-user-schema.js";
import User from "../Models/credientials-schema.js";
import ManagerUserAssignment from "../Models/assign-user-to-manager.js";
import Task from "../Models/task-schema.js";

export const addUser = async (req, res) => {
    try {
        const { name, email, password, role, assignedUsers, managerId } = req.body;
        const adminId = req.user._id;

        const admin = await User.findById(adminId);
        if (admin.role !== 'admin') {
            return FailureResponse(res, "Only admins can add users", null, 403);
        }

        if (role === 'user' && assignedUsers?.length > 0) {
            return FailureResponse(res, "Regular users cannot have assigned users", null, 400);
        }

        if (role === 'manager' && assignedUsers && !Array.isArray(assignedUsers)) {
            return FailureResponse(res, "Assigned users for managers should be in an array", null, 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const commonUserData = {
            name,
            email,
            password: hashedPassword,
            role,
        };

        const createdUser = await User.create(commonUserData);

        if (role === 'admin') {
            await Admin.create({ adminId: createdUser._id, name, email, password: hashedPassword });
        } else if (role === 'manager') {
            await Manager.create({
                managerId: createdUser._id,
                name,
                email,
                password: hashedPassword,
                assignedUsers: assignedUsers || [],
            });
        } else if (role === 'user') {
            await RegularUser.create({ regularUserId: createdUser._id, name, email, password: hashedPassword });
        } else {
            return FailureResponse(res, "Invalid role provided", null, 400);
        }

        return SuccessResponse(res, "User added successfully", { createdUser }, 201);
    } catch (error) {
        console.error("Error in addUser:", error);
        return FailureResponse(res, "Internal Server Error", null, 500);
    }
};
export const assignUsersToManager = async (req, res) => {
    try {
        const { managerId, userIds } = req.body;
        const admin = await User.findById(req.user._id); 
        if (!admin || admin.role !== 'admin') {
            return FailureResponse(res, "Only admin can assign users to managers", null, 403); 
        }

        const manager = await User.findById(managerId);
        if (!manager || manager.role !== 'manager') {
            return FailureResponse(res, "Manager not found or user is not a manager", null, 404);
        }

        const users = await User.find({ '_id': { $in: userIds } });
        if (users.length !== userIds.length) {
            return FailureResponse(res, "Some of the users do not exist", null, 404);
        }

        for (const user of users) {
            if (user.role === 'manager') {
                return FailureResponse(res, "You cannot assign another manager to this user", null, 400);
            }
            user.assignedManager = managerId;
            await user.save(); 
        }

        const managerInManagerTable = await Manager.findOne({ managerId: managerId });
        if (!managerInManagerTable) {
            return FailureResponse(res, "Manager not found in Manager table", null, 404);
        }

        managerInManagerTable.assignedUsers.push(...userIds);
        await managerInManagerTable.save();

        manager.assignedUsers.push(...userIds);
        await manager.save();

        let assignment = await ManagerUserAssignment.findOne({ managerId });
        if (assignment) {
            assignment.userIds.push(...userIds);
            await assignment.save();
        } else {
            assignment = new ManagerUserAssignment({ managerId, userIds });
            await assignment.save();
        }

        return SuccessResponse(res, "Users assigned to manager successfully", { assignment }, 200);
    } catch (error) {
        console.log(error);
        return FailureResponse(res, "Internal Server Error", null, 500);
    }
};
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user._id;

        const admin = await User.findById(adminId);
        if (admin.role !== 'admin') {
            return FailureResponse(res, "Only admins can delete users", null, 403);
        }

        const userToDelete = await User.findById(id);
        if (!userToDelete) {
            return FailureResponse(res, "User not found", null, 404);
        }

        if (userToDelete.role === 'manager') {
            const assignment = await ManagerUserAssignment.findOne({ managerId: id });
            if (assignment) {
                await ManagerUserAssignment.deleteOne({ managerId: id });
            }
        }

        await RegularUser.findOneAndDelete({ regularUserId: id });
        await Manager.findOneAndDelete({ managerId: id });

        await User.findByIdAndDelete(id);

        return SuccessResponse(res, 'User has been deleted', { deletedUser: userToDelete }, 200);
    } catch (error) {
        console.log(error);
        return FailureResponse(res, 'Internal Server Error', null, 500);
    }
};
export const editUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, role, assignedUsers } = req.body;
        const adminId = req.user._id;
        const admin = await User.findById(adminId);
        if (admin.role !== 'admin') {
            return FailureResponse(res, "Only admins can edit users", null, 403);
        }
        const userToEdit = await User.findById(id);
        if (!userToEdit) {
            return FailureResponse(res, "User not found", null, 404);
        }

        console.log(userToEdit.role);
        

        if (userToEdit.role !== 'user' && userToEdit.role !== 'manager') {
            return FailureResponse(res, "You can only edit users with 'user' or 'manager' roles", null, 400);
        }

        if (name) userToEdit.name = name;
        if (email) userToEdit.email = email;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            userToEdit.password = hashedPassword;
        }
        if (role) userToEdit.role = role;
        if (role === 'manager' && assignedUsers) {
            userToEdit.assignedUsers = assignedUsers;
        }

        await userToEdit.save();

        const regularUser = await RegularUser.findOne({ regularUserId: userToEdit._id });
        if (regularUser) {
            regularUser.name = userToEdit.name;
            regularUser.email = userToEdit.email;
            regularUser.password = userToEdit.password;
            regularUser.role = userToEdit.role;
            regularUser.assignedUsers = userToEdit.assignedUsers || [];
            await regularUser.save();
        }

        if (userToEdit.role === 'manager') {
            let managerData = await Manager.findOne({ managerId: userToEdit._id });

            if (managerData) {
                managerData.name = userToEdit.name;
                managerData.email = userToEdit.email;
                managerData.password = userToEdit.password;
                managerData.assignedUsers = assignedUsers || [];
                await managerData.save();
            } 
        } else if (role === 'user') {
            // If the role is user, delete any corresponding manager data
            await Manager.findOneAndDelete({ managerId: userToEdit._id });
        }

        return SuccessResponse(res, "User updated successfully", { updatedUser: userToEdit }, 200);
    } catch (error) {
        console.log(error);
        return FailureResponse(res, 'Internal Server Error', null, 500);
    }
};
export const viewAllUsers = async (req, res) => {
    try {
        const userId = req.user._id;
        if (!userId) {
            return FailureResponse(res, 'User not found', null, 404);
        }

        const user = await User.findById(userId);
        if (!user) {
            return FailureResponse(res, 'User not found', null, 404);
        }

        if (user.role !== 'admin') {
            return FailureResponse(res, 'Only admins can view all users', null, 403);
        }

        const users = await User.find({ role: { $in: ['manager', 'user'] } });
        return SuccessResponse(res, 'Fetched All Users', { users }, 200);
    } catch (error) {
        console.log("Error in viewAllUsers Controller:", error);
        return FailureResponse(res, 'Internal Server Error', null, 500);
    }
};
export const viewUserTasks = async (req, res) => {
    try {
        const adminId = req.user._id;
        if(!adminId){
            return FailureResponse(res, 'You are not authorized ', null, 400)
        }
        const { userId } = req.params; 

        const tasks = await Task.find({ creatorId: userId }).populate('creatorId', 'name email');
        if (!tasks || tasks.length === 0) {
            return FailureResponse(res, "No tasks found for this user", null, 404);
        }

        return SuccessResponse(res, "Tasks fetched successfully", { tasks }, 200);
    } catch (error) {
        console.log(error);
        return FailureResponse(res, "Internal Server Error", null, 500);
    }
};
export const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params; 
        const { userId, title, description, dueDate, status } = req.body; 

        if(!userId){
            return FailureResponse(res, 'UserId is required', null, 400)
        }

        const task = await Task.findOne({ _id: taskId, creatorId: userId });
        if (!task) {
            return FailureResponse(res, "Task not found for this user", null, 404);
        }

        if (title) task.title = title;
        if (description) task.description = description;
        if (dueDate) task.dueDate = new Date(dueDate);
        if (status) task.status = status;

        await task.save();

        return SuccessResponse(res, "Task updated successfully", { task }, 200);
    } catch (error) {
        console.log(error);
        return FailureResponse(res, "Internal Server Error", null, 500);
    }
};
export const deleteTask = async (req, res) => {
    try {
        const {  taskId } = req.params;

        const task = await Task.findOneAndDelete({ _id: taskId });
        if (!task) {
            return FailureResponse(res, "Task not found for this user", null, 404);
        }

        return SuccessResponse(res, "Task deleted successfully", null, 200);
    } catch (error) {
        console.log(error);
        return FailureResponse(res, "Internal Server Error", null, 500);
    }
};
export const getManagers = async (req, res) => {
    try {
        const managers = await User.find({ role: 'manager' });

        if (managers.length === 0) {
            return FailureResponse(res, "No managers found", null, 404);
        }

        return SuccessResponse(res, "Fetched all managers", { managers }, 200);
    } catch (error) {
        console.log(error);
        return FailureResponse(res, "Internal Server Error", null, 500);
    }
};
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' });

        if (users.length === 0) {
            return FailureResponse(res, "No users found", null, 404);
        }

        return SuccessResponse(res, "Fetched all users", { users }, 200);
    } catch (error) {
        console.log(error);
        return FailureResponse(res, "Internal Server Error", null, 500);
    }
};





