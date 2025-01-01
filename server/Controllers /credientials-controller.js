import { FailureResponse, SuccessResponse } from "../Helper/helper.js";
import User from "../Models/credientials-schema.js";
import bcrypt from 'bcrypt'
import { generateToken } from "../Security/security.js";
import { Admin } from "../Models/admin-schema.js";
import { Manager } from "../Models/manager-schema.js";
import { RegularUser } from "../Models/regular-user-schema.js";

export const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password){
            return FailureResponse(res, 'name, email or password is required')
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: hashedPassword, role: 'admin' });

        await Admin.create({
            adminId: user._id, name, email, password
        })

        return SuccessResponse(res, 'Admin Signup Successfully', {user}, 200)

    } catch (error) {
        console.log(error);
        return FailureResponse(res, 'Internal Server Error', null, 500)
    }
};
export const registerManager = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password){
            return FailureResponse(res, 'name, email or password is required')
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: hashedPassword, role: 'manager' });

        await Manager.create({
            managerId: user._id, name, email, password
        })

        return SuccessResponse(res, 'Manger Signup Successfully', {user}, 200)
        
    } catch (error) {
        console.log(error);
        return FailureResponse(res, 'Internal Server Error', null, 500)
    }
};
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password){
            return FailureResponse(res, 'name, email or password is required')
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: hashedPassword, role: 'user' });

        await RegularUser.create({
            regularUserId: user._id, name, email, password
        })
        return SuccessResponse(res, 'User Signup Successfully', {user}, 200)
        
    } catch (error) {
        console.log(error);
        return FailureResponse(res, 'Internal Server Error', null, 500)
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return FailureResponse(res, 'User not found', null, 400)
        }
        const comparePassword = bcrypt.compare(password, user.password)
        if(!comparePassword){
            return FailureResponse(res, 'Invalid Password', null, 400)
        }

        const token = generateToken(user._id, user.role);
        const data = {
            token,
            role : user.role
        }

        return SuccessResponse(res, `${user.role} is logged in successfully`, {data}, 200)
    } catch (error) {
        console.log(error);
        return FailureResponse(res, 'Internal Server Error', null, 500)
    }
}