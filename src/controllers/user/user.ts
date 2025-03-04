import { Request, Response } from "express";
import AppDataSource from "../../config/ormconfig";
import { Users } from "../../entities/user.entity";
import { Opt } from "../../entities/opt.entity";
import { sign } from "../../utils/jwt";
import { mailService } from "../../utils/mailService";

const userRepository = AppDataSource.getRepository(Users);
const optRepository = AppDataSource.getRepository(Opt);

export const OAuthCallback = async (req: Request, res: Response): Promise<any> => {
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
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const sendOtp = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    const opt = await optRepository.findOne({ where: { email } });
    const currentTime = new Date();
    
    if (opt) {
        const createdAt = new Date(opt.createdAt);
        const timeDifference = (currentTime.getTime() - createdAt.getTime()) / 1000;
        
        if (timeDifference < 180) {
            return res.status(400).json({ message: 'OTP already sent, please try again' });
        } else {
            await optRepository.delete(opt.id);
        }
    }
    
    const newOpt = new Opt();
    newOpt.email = email;
    newOpt.optCode = otp;
    await optRepository.save(newOpt);
    
    await mailService(email, otp);

    return res.status(200).json({
      message: 'OTP sent successfully'
    });
  } catch (error) {
    return res.status(500).json({ message: "Error sending OTP", error });
  }
};

export const signup = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, optCode } = req.body;

    const opt = await optRepository.findOne({ where: { email } });
    if (!opt) return res.status(400).json({ message: "OTP not found" });

    if (opt.optCode !== optCode) return res.status(400).json({ message: "Invalid OTP" });

    const existingUser = await userRepository.findOne({ where: { email } });

    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

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
    // console.log(error?.message);

    return res.status(500).json({ message: "Error creating user", error });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    const user = await userRepository.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword)
      return res.status(400).json({ message: "Invalid credentials" });

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
    console.log(error);
    return res.status(500).json({ message: "Error logging in", error });
  }
};

export const updateProfile = async ( req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;

    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

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
    return res.status(500).json({ message: "Error updating profile", error });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<any> => {
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

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json({
            data:user,
            error: null,
            status: 200
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};
