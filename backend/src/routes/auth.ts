import express, { Request, Response, Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/userRepository';
import { FirestoreUserRepository } from '../repositories/FirestoreUserRepository';
import { User } from '../constants/types';

const router: Router = express.Router();

const userRepository: UserRepository = new FirestoreUserRepository();

router.post("/login" , async (req : Request, res : Response) => {

  const {email, password} = req.body;

  try{
    const user = await userRepository.getUserByEmail(email);

    // it is better to say invalid credentials than invalid email or invalid password for security reasons
    if (!user) {
      res.status(400).json({
        message: "Invalid credentials",
      });
      return;
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    
    if (!isPasswordMatch) {
      res.status(400).json({
        message: "Invalid credentials",
      });
      return;
    }

    // generate a token
    const token = jwt.sign({
        userId: user.userId,
    }, process.env.JWT_SECRET_KEY as string, {
        expiresIn: "20d",
    })

    // send the token as part of the response
    res.status(200).json({
      message: "Logged in Successfully",
      user: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      token
    })

  } catch (error){
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    // Basic input validation
    if (!firstName || !lastName || !email || !password) {
      res.status(400).json({ message: 'All fields (firstName, lastName, email, password) are required.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData: User = {
      userId: '', // Will be filled by FirestoreUserRepository
      firstName,
      lastName,
      email,
      password: hashedPassword,
    };

    const newUser = await userRepository.createUser(userData);

    if (!newUser) {
      res.status(500).json({ message: 'Failed to create user.' });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET_KEY;

    const token = jwt.sign({ userId: newUser.userId }, jwtSecret as string, { expiresIn: '20d' }); // Token expires in 20 days

    res.status(201).json({ 
      message: 'User registered successfully', 
      token, 
      user: {
        userId: newUser.userId,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email
      }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    // Provide more specific error messages based on the type of error
    if (error.message.includes('User with this email already exists')) {
      res.status(409).json({ message: error.message }); // 409 Conflict
      return;
    }
    res.status(500).json({ message: 'Failed to register user.', error: error.message });
  }
}); 

export default router;