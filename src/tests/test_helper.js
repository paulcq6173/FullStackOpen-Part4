import Blog from '../models/blogModel.js';
import User from '../models/userModel.js';

const dummyData = [
  {
    title: 'G research report',
    author: 'Annette Birkin',
    url: 'umbrella corp lab in raccon city',
    likes: 0,
  },
  {
    title: 'G-Virus sample report',
    author: 'Ada Wong',
    url: 'somewhere out of raccon city',
    likes: 1,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((e) => e.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

export { blogsInDb, dummyData, usersInDb };
