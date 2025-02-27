import prisma from './prisma'

export async function getAllBlogs() {
  const blogs = await prisma.blog.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })

  return blogs
}

export async function getBlogById(id: string) {
  const blog = await prisma.blog.findUnique({
    where: {
      id
    }
  })

  return blog
}
