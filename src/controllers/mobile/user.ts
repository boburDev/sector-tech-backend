import { NextFunction, Request, Response } from "express";
import AppDataSource from "../../config/ormconfig";
import { Users } from "../../entities/user.entity";
import { Opt } from "../../entities/opt.entity";
import { sign } from "../../utils/jwt";
import { mailService } from "../../utils/mailService";
import { CustomError } from "../../error-handling/error-handling";
import * as bcrypt from "bcrypt";
const userRepository = AppDataSource.getRepository(Users);
const optRepository = AppDataSource.getRepository(Opt);

export const OAuthCallback = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { name, email } = req.user as { email: string; name: string };

    let user = await userRepository.findOne({ where: { email } });

    if (!user) {
      const newUser = new Users();
      newUser.name = name || "";
      newUser.email = email;
      newUser.password = "";
      newUser.phone = "";
      user = await userRepository.save(newUser);
    }

    const token = sign(
      { id: user.id, email: user.email },
      86400000, // 1 day
      "user"
    );

    return res.redirect(`http://localhost:3000?token=${token}`);
  } catch (error) {
    next(error);
  }
};

export const sendOtp = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { email } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    const opt = await optRepository.findOne({ where: { email } });
    const currentTime = new Date();
    
    if (opt) {
        const createdAt = new Date(opt.createdAt);
        const timeDifference = (currentTime.getTime() - createdAt.getTime()) / 1000;
        
        if (timeDifference < 180) throw new CustomError('OTP already sent, please try again', 400);
        else await optRepository.delete(opt.id);
    }
    
    const newOpt = new Opt();
    newOpt.email = email;
    newOpt.optCode = otp;
    await optRepository.save(newOpt);
    
    const mailStatus = await mailService(email, otp);
    
    if (!mailStatus.success) {
      await optRepository.delete({ email });
      throw new CustomError("Error sending OTP", 500);
    }

    return res.status(200).json({
      message: 'OTP sent successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { email, optCode } = req.body;

    const opt = await optRepository.findOne({ where: { email } });
    if (!opt) throw new CustomError("OTP not found", 400);
    if (opt.optCode !== optCode) throw new CustomError("Invalid OTP", 400);

    await optRepository.delete({ email });

    let user = await userRepository.findOne({ where: { email } });

    let message: string;

    if (!user) {
      const newUser = new Users();
      newUser.email = email;
      user = await userRepository.save(newUser);
      message = "You have successfully registered";
    } else {
      message = "You have already registered";
    }

    const token = sign(
      { id: user.id, email: user.email },
      86400000, // 1 kun
      "user"
    );

    return res.status(200).json({
      message,
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });

  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { email, password } = req.body;
    const user = await userRepository.findOne({ where: { email } });
    if (!user) throw new CustomError("Invalid credentials", 400);
    
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) throw new CustomError("Invalid credentials", 400);

    const token = sign(
      { id: user.id, email: user.email },
      86400000, // 1 day in milliseconds
      "user"
    );

    const userData = {
      id: user.id,
      email: user.email,
    };

    return res.json({
      message: "User logged in successfully",
      token,
      user: userData,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async ( req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;

    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) throw new CustomError("User not found", 404);

    user.name = name || user.name;
    user.email = email || user.email;
    await userRepository.save(user);

    const token = sign(
      { id: user.id, email: user.email },
      86400000, // 1 day in milliseconds
      "user"
    );

    const userData = {
      id: user.id,
      email: user.email,
    };

    return res.json({
      message: "Profile updated successfully",
      token,
      user: userData,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.user;
        const user = await userRepository.findOne({ 
            where: { 
                id
            },
            select:{
              id:true,
              name:true,
              email:true,
              phone:true
            }
        });

        if (!user) throw new CustomError('User not found', 404);

        return res.json({
            data:user,
            error: null,
            status: 200
        });

    } catch (error) {
        next(error);
    }
};

export const updateUserPassword = async (req: Request, res: Response, next: NextFunction): Promise<any> => {  
  try {
    const { oldPassword, newPassword } = req.body;
    const { id } = req.user;

    if (!newPassword) {
      throw new CustomError("New password is required", 400);
    }

    const user = await userRepository.findOne({ where: { id } });
    if (!user) throw new CustomError("User not found", 404);

    if (oldPassword) {
      const isValidPassword = await user.validatePassword(oldPassword);

      if (!isValidPassword) {
        console.warn("Eski parol noto'g'ri, lekin baribir yangilayapmiz.");
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await userRepository.save(user);

    const token = sign(
      { id: user.id, email: user.email },
      86400000,
      'user'
    );

    return res.status(200).json({
      message: "Password updated successfully",
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });

  } catch (error) {
    next(error);
  }
};

export const confirmEmailChange = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const userId = req.user.id;
    const { name, email, otpCode } = req.body;

    if (!otpCode || !email) throw new CustomError("Email va tasdiqlash kodi kerak", 400);

    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) throw new CustomError("User not found", 404);

    const otp = await optRepository.findOne({ where: { email } });
    if (!otp || otp.optCode !== otpCode) {
      throw new CustomError("Tasdiqlash kodi noto'g'ri", 400);
    }

    await optRepository.delete({ email });

    user.name = name || user.name;
    user.email = email;
    await userRepository.save(user);

    const token = sign(
      { id: user.id, email: user.email },
      86400000,
      "user"
    );

    return res.json({
      message: "Profil muvaffaqiyatli yangilandi",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    next(error);
  }
};