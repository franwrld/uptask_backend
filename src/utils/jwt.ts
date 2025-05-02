import jwt from 'jsonwebtoken'
import Types from 'mongoose'

type UserPayload = {
    id: string;
}

export const generateJWT = (payload: UserPayload): string => {
    const token = jwt.sign(
        { id: payload.id.toString() }, // Convertimos ObjectId a string
        process.env.JWT_SECRET!,
        { expiresIn: '180d' }
    );
    return token;
};