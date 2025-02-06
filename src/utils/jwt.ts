import jwt from 'jsonwebtoken'
const secretKey: string = process.env.JWT_SECRET || 'there_is_bad_guy'

// 60sec * 60min * 24hour = 1d   
function sign(payload: any, expireTime: number = 600000) {
    return jwt.sign(payload, secretKey, { expiresIn: expireTime })
}

function verify(token: string): any | null {
    try {
        const decoded: any = jwt.verify(token, secretKey) as any;
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