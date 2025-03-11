import { NextFunction, Request, Response } from "express";
import AppDataSource from "../../config/ormconfig";
import { Users } from "../../entities/user.entity";
import { Opt } from "../../entities/opt.entity";
import { sign } from "../../utils/jwt";
import { mailService } from "../../utils/mailService";
import { CustomError } from "../../error-handling/error-handling";
const userRepository = AppDataSource.getRepository(Users);
const optRepository = AppDataSource.getRepository(Opt);

export const OAuthCallback = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { name, email } = req.user as { email: string; name: string };

    let user = await userRepository.findOne({ where: { email } });

    if (user) {
      const accessToken = sign(
        { id: user.id, email: user.email },
        86400000, // 1 kun (24 soat)
        "user"
      );
      return res.status(201).redirect(`http://localhost:3000?token=${accessToken}`);

    } else {
      const newUser = new Users();
      newUser.name = name;
      newUser.email = email;
      newUser.password = "";
      newUser.phone = "";
      const savedUser = await userRepository.save(newUser);

      const token = sign(
        { id: savedUser.id, email: savedUser.email },
        86400000, // 1 day in milliseconds
        "user"
      );

      return res.status(201).redirect(`http://localhost:3000?token=${token}`);
    }
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

    const existingUser = await userRepository.findOne({ where: { email } });

    if (existingUser) throw new CustomError("User already exists", 400);

    const newUser = new Users();
    newUser.email = email;
    const savedUser = await userRepository.save(newUser);

    const token = sign(
      { id: savedUser.id, email: savedUser.email },
      86400000, // 1 day in milliseconds
      "user"
    );

    const userData = {
      id: savedUser.id,
      email: savedUser.email
    };

    return res.status(201).json({ message: "User created successfully", token, user: userData });
  } catch (error: any) {
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
