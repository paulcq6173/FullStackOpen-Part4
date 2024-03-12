import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import assert, { strictEqual } from 'node:assert';
import { after, beforeEach, describe, test } from 'node:test';
import supertest from 'supertest';
import app from '../app.js';
import Blog from '../models/blogModel.js';
import User from '../models/userModel.js';
import { blogsInDb, dummyData, usersInDb } from './test_helper.js';

const api = supertest(app);

// ESM syntax not supported yet.
const { connection } = mongoose;

describe('test dummy blogs', () => {
  // Initialize before test start.
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(dummyData);

    //const blogObjects = dummyData.map((e) => new Blog(e));
    // To avoid test start before Initialize finished,
    // this syntax is neccessary.
    // And the order of execution is not guaranteed.
    //await Promise.all(blogObjects.map((e) => e.save()));
  });

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
});

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('secret', 10);
    const user = new User({
      username: 'root',
      name: 'superuser',
      passwordHash,
    });

    await user.save();
  });

  test('creation succeeds with a unique username', async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: 'lumin',
      name: 'user',
      password: 'niceguy',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await usersInDb();
    strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });
});

describe('create duplicated user fail test', () => {
  test('should get status code 400', async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: 'lumin',
      name: 'superuser',
      password: 'niceguy',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await usersInDb();
    assert(result.body.error.includes('expected `username` to be unique'));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});

describe('create new blog with jwt test', () => {
  test('should added successfully', async () => {
    const loginData = {
      username: 'lumin',
      password: 'niceguy',
    };

    const loginUserRes = await api
      .post('/api/login/')
      .send(loginData)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const token = loginUserRes.body.token;

    const newObject = {
      title: 'A new dawn is coming',
      author: 'Albert Wesker',
      url: 'https://residentevil.fandom.com/wiki/Albert_Wesker',
      likes: 605,
    };

    await api
      .post('/api/blogs')
      .set({ Authorization: `Bearer ${token}` })
      .send(newObject)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const Allblogs = await blogsInDb();

    strictEqual(Allblogs.length, dummyData.length + 1);
  });
});

describe('create new blog with no jwt provided test', () => {
  test('should failed to add and get status code 401', async () => {
    const newObject = {
      title: 'The oroboros leading a new world',
      author: 'Albert Wesker',
      url: 'https://residentevil.fandom.com/wiki/Albert_Wesker',
      likes: 114,
    };

    await api
      .post('/api/blogs')
      .send(newObject)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    const Allblogs = await blogsInDb();

    strictEqual(Allblogs.length, dummyData.length + 1);
  });
});

/*describe('update doc test', () => {
  test('should response status code:200', async () => {
    const allBlogs = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const secondBlog = allBlogs.body[1];
    const updateObj = {
      likes: 15,
    };

    const response = await api
      .put(`/api/blogs/${secondBlog.id}`)
      .send(updateObj)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    strictEqual(response.body.likes, 15);
  });
});*/

/*describe('delete doc test', () => {
  test('should response status code:204', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
    const reqBlog = response.body[1];

    await api.delete(`/api/blogs/${reqBlog.id}`).expect(204);
  });
});*/

/*describe('unique id object test', () => {
  test('validate id field should pass', async () => {
    const response = await api.get('/api/blogs');
    const fieldArr = Object.keys(response.body[0]);
    let field;
    for (let i = 0; i < fieldArr.length; i++) {
      if (fieldArr[i].includes('id')) {
        field = fieldArr[i];
        break;
      }
    }

    strictEqual(field, 'id');
  });
});*/

after(async () => {
  await connection.close();
});
