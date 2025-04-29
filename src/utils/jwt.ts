import jwt from 'jsonwebtoken'
import { JWT_SECRET, JWT_SECRET_USER } from '../config/env';

const secretKey: string = String(JWT_SECRET)
const secretKeyUser: string = String(JWT_SECRET_USER)

// 60sec * 60min * 24hour = 1d   
function sign(payload: any, expireTime: number = 60 * 60 * 24, role?: string) {
    return jwt.sign(payload, role === 'user' ? secretKeyUser : secretKey, { expiresIn: expireTime })
}

function verify(token: string, role?: string): any | null {
    try {
        const decoded: any = jwt.verify(token, role === 'user' ? secretKeyUser : secretKey) as any;
        return decoded;
    } catch (error) {
        console.error('Token verification error:', (error as Error).message);
        return null;
    }
}
export {
    sign,
    verify
}