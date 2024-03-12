/*import { strictEqual } from 'node:assert';
import { describe, test } from 'node:test';
import listHelper from '../utils/list_helper.js';
import logger from '../utils/logger.js';

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0,
  },
];
const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
];

describe('total likes', () => {
  test('of empty array is zero', () => {
    strictEqual(listHelper.average([]), 0);
  });
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    strictEqual(result, 5);
  });
  test('of the bigger list is calculate right', () => {
    const result = listHelper.totalLikes(blogs);
    strictEqual(result, 36);
  });
});

describe('most favorite blog', () => {
  test('of the most favorite blog', () => {
    const result = listHelper.favoriteBlog(blogs);
    logger.info('most favorite blog:', result);
  });
});

describe('the author that have most blogs', () => {
  test('of the author and blogs', () => {
    let result;
    if (blogs.length > 1) {
      result = listHelper.mostBlogs(blogs);
    } else {
      result = { author: blogs[0].author, blogs: 1 };
    }
    logger.info('most blogs author:', result);
  });
});

describe('the author that most favorite', () => {
  test('of the author and likes', () => {
    let result;
    if (blogs.length > 1) {
      result = listHelper.mostLikes(blogs);
    } else {
      result = { author: blogs[0].author, likes: blogs[0].likes };
    }
    logger.info('most favorite author:', result);
  });
});*/
