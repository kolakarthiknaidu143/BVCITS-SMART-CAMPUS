import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Student } from '../models/Student';
import { Parent } from '../models/Parent';
import { Faculty } from '../models/Faculty';
import { AuthRequest } from '../middleware/auth';

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim() === '') {
    console.error('❌ FATAL CONFIGURATION ERROR: JWT_SECRET environment variable is missing.');
    throw new Error('JWT_SECRET is not configured on the server.');
  }
  return secret;
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, phone, rollNumber, department, employeeId } = req.body;

    if (!name || !email || !password || !role) {
      res.status(400).json({ success: false, message: 'Name, email, password, and role are required.' });
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'User with this email already exists.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      phone: phone || '',
    });

    // Create role-specific profiles
    if (role === 'student' && rollNumber) {
      await Student.create({
        userId: user._id,
        rollNumber: rollNumber.toUpperCase(),
        department: department || 'Computer Science & Engineering',
        semester: 1,
        cgpa: 0.0,
        attendancePercentage: 100,
      });
    } else if (role === 'faculty' && employeeId) {
      await Faculty.create({
        userId: user._id,
        employeeId,
        department: department || 'Computer Science & Engineering',
        designation: 'Assistant Professor',
        assignedSubjects: [],
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      token,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error during registration.' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password || '');
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error during login.' });
  }
};

export const demoLoginUser = async (req: Request, res: Response) => {
  try {
    const { role } = req.body;
    const validRoles = ['student', 'parent', 'faculty', 'admin', 'recruiter', 'trainer'];

    if (!role || !validRoles.includes(role)) {
      res.status(400).json({ success: false, message: 'Invalid role requested for demo login.' });
      return;
    }

    const demoEmails: Record<string, string> = {
      student: 'student@bvcits.edu.in',
      parent: 'parent@bvcits.edu.in',
      faculty: 'faculty@bvcits.edu.in',
      admin: 'admin@bvcits.edu.in',
      recruiter: 'recruiter@bvcits.edu.in',
      trainer: 'trainer@bvcits.edu.in',
    };

    const targetEmail = demoEmails[role];
    let user = await User.findOne({ email: targetEmail });

    if (!user) {
      // Fallback lookup by role if specific demo email wasn't found
      user = await User.findOne({ role });
    }

    if (!user) {
      res.status(404).json({ success: false, message: `Demo account for role '${role}' not found in database.` });
      return;
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: `Demo login successful as ${role.toUpperCase()}`,
      token,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error during demo login.' });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    let extraProfile = null;
    if (user.role === 'student') {
      extraProfile = await Student.findOne({ userId: user._id }).populate('parentUserId', 'name email phone');
    } else if (user.role === 'parent') {
      extraProfile = await Parent.findOne({ userId: user._id }).populate('studentUserId', 'name email phone');
    } else if (user.role === 'faculty') {
      extraProfile = await Faculty.findOne({ userId: user._id });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profileImage: user.profileImage,
        profileDetails: extraProfile,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error retrieving user details.' });
  }
};

export const logoutUser = async (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Logged out successfully.' });
};

