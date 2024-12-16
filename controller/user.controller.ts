import { Request, Response } from "express";
import prisma from "../db/db.config";

export const createUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password } = req.body;

    const findUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (findUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
export const createMultipleUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { users } = req.body;

    const newUsers = await prisma.user.createMany({
      data: users,
      skipDuplicates: true,
    });

    return res.status(201).json({
      success: true,
      message: "Users created successfully",
      data: newUsers,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error?.message,
    });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  const updatedUser = await prisma.user.update({
    where: {
      id: Number(id),
    },
    data: {
      name,
      email,
      password,
    },
  });

  return res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: updatedUser,
  });
};

export const getUsers = async (req: Request, res: Response): Promise<any> => {
  // Get all users with their post
  // const users = await prisma.user.findMany({
  //   include: {
  //     posts: {
  //       select: {
  //         id: true,
  //         title: true,
  //         slug: true,
  //         comment_count: true,
  //         user_id: true,
  //       },
  //     },
  //   },
  // });

  // Get users with only post and comment count
  const users = await prisma.user.findMany({
    select: {
      _count: {
        select: {
          posts: true,
          comments: true,
        },
      },
    },
  });

  return res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    data: users,
  });
};

export const getUser = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const user = await prisma.user.findFirst({
    where: {
      id: Number(id),
    },
  });
  return res.status(200).json({
    success: true,
    message: "User fetched successfully",
    data: user,
  });
};

export const deleteUser = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const user = await prisma.user.delete({
    where: {
      id: Number(id),
    },
  });
  return res.status(200).json({
    success: true,
    message: "User deleted successfully",
    data: user,
  });
};

export const deleteMultipleUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { ids } = req.body;
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    return res.status(200).json({
      success: true,
      message: "Users deleted successfully",
      data: deletedUsers,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err?.message,
    });
  }
};
