import jwt from 'jsonwebtoken'
const secretKey: string = process.env.JWT_SECRET || 'there_is_bad_guy'
const secretKeyUser: string = process.env.JWT_SECRET_USER || 'awasome_secret_key'

// 60sec * 60min * 24hour = 1d   
function sign(payload: any, expireTime: number = 600000, role?: string) {
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