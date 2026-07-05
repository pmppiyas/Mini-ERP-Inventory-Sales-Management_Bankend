import { IUser, IUserResponse } from './user,interface';
import { User } from './user.model';

const createUser = async (userData: IUser): Promise<IUserResponse> => {
  try {
    const existingUser = await User.findOne({ email: userData.email });

    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const user = await User.create(userData);

    const response: IUserResponse = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return response;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const UserService = {
  createUser,
};
