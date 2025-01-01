import jwt from 'jsonwebtoken'


export const generateToken = (userId, role) =>{
    const payload = {userId, role}
    const result = jwt.sign(payload, process.env.JWT_SECRET)
    return result
}
