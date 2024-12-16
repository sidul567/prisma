import { Request, Response } from "express";
import prisma from "../db/db.config";
import slugify from "slugify";

export const createPost = async (req: Request, res: Response): Promise<any> => {
  try {
    const { title, description, user_id } = req.body;
    let slug = slugify(title, { lower: true });

    const isExistSlug = await prisma.post.findUnique({
      where: {
        slug,
      },
    });

    if (isExistSlug) {
      const totalExistSlug = await prisma.post.count({
        where: {
          slug: {
            startsWith: slug + "-",
          },
        },
      });
      slug = `${slug}-${totalExistSlug + 2}`;
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        description,
        user_id,
        slug,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: newPost,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
export const createMultiplePost = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { posts } = req.body;

    const newPosts = await prisma.post.createMany({
      data: posts,
      skipDuplicates: true,
    });

    return res.status(201).json({
      success: true,
      message: "Posts created successfully",
      data: newPosts,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error?.message,
    });
  }
};

export const updatePost = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const { title, description } = req.body;

  const updatedPost = await prisma.post.update({
    where: {
      id: Number(id),
    },
    data: {
      title,
      description,
    },
  });

  return res.status(200).json({
    success: true,
    message: "Post updated successfully",
    data: updatedPost,
  });
};

export const getPosts = async (req: Request, res: Response): Promise<any> => {
  const { s } = req.query;
  let page = Number(req.query?.page);
  let limit = Number(req.query?.limit);

  if (!page || page <= 0) {
    page = 1;
  }

  if (!limit || limit <= 0 || limit >= 100) {
    limit = 10;
  }

  const skip = (page - 1) * limit;

  const posts = await prisma.post.findMany({
    orderBy: {
      id: "asc",
    },
    include: {
      comments: {
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
    // where: {
    //   OR: [
    //     {
    //       title: {
    //         startsWith: "Next",
    //       },
    //     },
    //     {
    //       title: {
    //         endsWith: "blog",
    //       },
    //     },
    //   ],
    // },
    where: {
      description: s && {
        search: s?.toString() || "",
      },
    },
    skip,
    take: limit,
  });

  const totalPosts = await prisma.post.count();
  const totalPages = Math.ceil(totalPosts / limit);

  return res.status(200).json({
    success: true,
    message: "Posts fetched successfully",
    data: {
      current_page: page,
      data: posts,
      last_page: totalPages,
      total: totalPosts,
    },
  });
};

export const getPost = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const post = await prisma.post.findFirst({
    where: {
      id: Number(id),
    },
  });
  return res.status(200).json({
    success: true,
    message: "Post fetched successfully",
    data: post,
  });
};

export const deletePost = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const post = await prisma.post.delete({
    where: {
      id: Number(id),
    },
  });
  return res.status(200).json({
    success: true,
    message: "Post deleted successfully",
    data: post,
  });
};

export const deleteMultiplePost = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { ids } = req.body;
    const deletedPosts = await prisma.post.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    return res.status(200).json({
      success: true,
      message: "Posts deleted successfully",
      data: deletedPosts,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err?.message,
    });
  }
};
