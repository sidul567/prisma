import { Request, Response } from "express";
import prisma from "../db/db.config";
import slugify from "slugify";

export const createComment = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { comment, user_id, post_id } = req.body;

    const newComment = await prisma.comment.create({
      data: {
        comment,
        user_id,
        post_id,
      },
    });

    // Update post comment count
    await prisma.post.update({
      where: {
        id: post_id,
      },
      data: {
        comment_count: {
          increment: 1,
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Comment created successfully",
      data: newComment,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
export const createMultipleComment = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { comments } = req.body;

    const newComments = await prisma.comment.createMany({
      data: comments,
      skipDuplicates: true,
    });

    return res.status(201).json({
      success: true,
      message: "Comments created successfully",
      data: newComments,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error?.message,
    });
  }
};

export const updateComment = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;
  const { comment } = req.body;

  const updatedComment = await prisma.comment.update({
    where: {
      id,
    },
    data: {
      comment,
    },
  });

  return res.status(200).json({
    success: true,
    message: "Comment updated successfully",
    data: updatedComment,
  });
};

export const getComments = async (
  req: Request,
  res: Response
): Promise<any> => {
  const comments = await prisma.comment.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      posts: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  return res.status(200).json({
    success: true,
    message: "Comments fetched successfully",
    data: comments,
  });
};

export const getComment = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const comment = await prisma.comment.findFirst({
    where: {
      id,
    },
  });
  return res.status(200).json({
    success: true,
    message: "Comment fetched successfully",
    data: comment,
  });
};

export const deleteComment = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;
  const comment = await prisma.comment.delete({
    where: {
      id,
    },
  });

  // Update post comment count
  await prisma.post.update({
    where: {
      id: comment.post_id,
    },
    data: {
      comment_count: {
        increment: 1,
      },
    },
  });

  return res.status(200).json({
    success: true,
    message: "Comment deleted successfully",
    data: comment,
  });
};

export const deleteMultipleComment = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { ids } = req.body;
    const deletedComments = await prisma.comment.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    return res.status(200).json({
      success: true,
      message: "Comments deleted successfully",
      data: deletedComments,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err?.message,
    });
  }
};
