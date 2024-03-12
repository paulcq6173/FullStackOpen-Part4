import { Router } from 'express';
import Blog from '../models/blogModel.js';
import { userExtractor } from '../utils/middleware.js';

const blogRouter = Router();

blogRouter.post('/', userExtractor, async (request, response, next) => {
  const { title, author, url, likes } = request.body;

  const reqUser = request.user;

  if (!title || !url) {
    response.status(400).end();
  }
  const blog = new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes,
    user: reqUser.id,
  });

  try {
    const savedBlog = await blog.save();

    // Update user blogs array in collection
    reqUser.blogs = reqUser.blogs.concat(savedBlog._id);
    await reqUser.save();

    response.status(201).json(savedBlog);
  } catch (error) {
    next(error);
  }
});

blogRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', {
      username: 1,
      name: 1,
    });
    response.json(blogs);
  } catch (error) {
    next(error);
  }
});

blogRouter.put('/:id', async (request, response, next) => {
  const { title, author, url, likes } = request.body;
  const updateObj = {
    title: title,
    author: author,
    url: url,
    likes: likes,
  };

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      updateObj,
      { new: true }
    );
    response.json(updatedBlog);
  } catch (error) {
    next(error);
  }
});

blogRouter.delete('/:id', userExtractor, async (request, response, next) => {
  const reqId = request.params.id;
  const blog = await Blog.findById(reqId);
  if (!blog) {
    return response.status(404).json({
      error: `Requested blogID: ${reqId} not found`,
    });
  }
  // Transfer user object to string
  const blogUserID = blog.user.toString();

  const reqUser = request.user;
  if (blogUserID !== reqUser.id.toString()) {
    return response.status(401).json({
      error:
        'Unauthorized operation. Only authorized user can delete this blog.',
    });
  }

  try {
    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default blogRouter;
