import { NextFunction, Request, Response } from 'express'
import { CustomError } from '../error-handling/error-handling';
interface LoginAttempts {
    [ip: string]: {
        attempts: number;
        firstAttemptTime: number;
        blockedUntil: number | null;
    };
}

let loginAttempts: LoginAttempts = {};


export async function loginAttemptLimiter(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip || '';
    const currentTime = Date.now();
    const loginLimit = 5; // 5 attempts
    const blockDuration = 5 * 60 * 1000; // 5 minutes
    const attemptWindow = 60 * 1000; // 1 minute

    if (!loginAttempts[ip]) {
        loginAttempts[ip] = {
            attempts: 0,
            firstAttemptTime: currentTime,
            blockedUntil: null,
        };
    }

    const userAttempts = loginAttempts[ip];

    if (userAttempts.blockedUntil && userAttempts.blockedUntil > currentTime) {
        const blockTimeLeft = Math.ceil((userAttempts.blockedUntil - currentTime) / 1000);
        throw new CustomError(`Too many login attempts. Try again in ${blockTimeLeft} seconds.`, 429);
    }

    if (currentTime - userAttempts.firstAttemptTime < attemptWindow) {
        userAttempts.attempts += 1;
    } else {
        userAttempts.attempts = 1;
        userAttempts.firstAttemptTime = currentTime;
    }

    if (userAttempts.attempts > loginLimit) {
        userAttempts.blockedUntil = currentTime + blockDuration;
        throw new CustomError('Too many login attempts. Please try again in 5 minutes.', 429);
    }


    next();
}