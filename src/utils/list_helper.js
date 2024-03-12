const reverse = (string) => {
  return string.split('').reverse().join('');
};

const average = (array) => {
  const reducer = (sum, item) => {
    return sum + item;
  };

  return array.length === 0 ? 0 : array.reduce(reducer, 0) / array.length;
};

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  let count = 0;
  const newArr = blogs.map((e) => e.likes);
  for (let i = 0; i < newArr.length; i++) {
    count += newArr[i];
  }

  return count;
};

const favoriteBlog = (blogs) => {
  const maxCount = Math.max(...blogs.map((e) => e.likes));
  const arr = blogs.filter((e) => e.likes === maxCount);
  const blog = {
    title: arr[0].title,
    author: arr[0].author,
    likes: arr[0].likes,
  };
  return blog;
};

function compareAndFilte(authorA, authorB, array) {
  let j = 0;
  let k = 0;
  array.forEach((e) => {
    if (e === authorA) {
      j += 1;
    } else if (e === authorB) {
      k += 1;
    }
  });
  const result = Math.max(j, k);
  if (result === j) {
    array = array.filter((e) => e !== authorB);
  } else {
    array = array.filter((e) => e !== authorA);
  }

  return array;
}

function setNextAuthor(para1, result, array) {
  result = '';
  for (let i = 0; i < array.length; i++) {
    if (array[i] !== para1) {
      result = array[i];
      break;
    }
  }

  return result;
}

const mostBlogs = (blogs) => {
  let authors = blogs.map((e) => e.author);
  let prevAuthor = authors[0];
  let currentAuthor = '';
  let arrayA = [];
  let arrayB = [];
  let result;
  const len = authors.length;

  for (let i = 0; i < len; i++) {
    currentAuthor = setNextAuthor(prevAuthor, currentAuthor, authors);
    if (currentAuthor === '') {
      break;
    }
    authors = compareAndFilte(prevAuthor, currentAuthor, authors);

    let newObj = authors.find((e) => e === prevAuthor);
    if (!newObj) {
      prevAuthor = currentAuthor;
    }
  }

  arrayA = blogs.filter((e) => e.author === prevAuthor);
  arrayB = blogs.filter((e) => e.author === currentAuthor);
  const blogsA = arrayA.length;
  const blogsB = arrayB.length;
  if (blogsA >= blogsB) {
    result = { author: prevAuthor, blogs: blogsA };
  } else {
    result = { author: currentAuthor, blogs: blogsB };
  }

  return result;
};

function compareLikesFilter(prevAuthor, currentAuthor, array) {
  let j = 0;
  let k = 0;
  let likes = 0;

  for (let i = 0; i < array.length; i++) {
    likes = array[i].likes;
    if (likes <= 0) {
      continue;
    }
    if (array[i].author === prevAuthor) {
      j += likes;
    } else if (array[i].author === currentAuthor) {
      k += likes;
    }
  }
  const result = Math.max(j, k);
  if (result === j) {
    array = array.filter((e) => e.author !== currentAuthor);
  } else {
    array = array.filter((e) => e.author !== prevAuthor);
  }

  return array;
}

const mostLikes = (blogs) => {
  let authors = blogs.map((e) => e.author);
  let modifiedArray = blogs;
  let prevAuthor = blogs[0].author;
  let currentAuthor = '';
  let arrayA = [];
  let arrayB = [];
  let countA = 0;
  let countB = 0;
  let result;
  let newObj;

  for (let i = 1; i < blogs.length; i++) {
    currentAuthor = setNextAuthor(prevAuthor, currentAuthor, authors);
    if (currentAuthor === '') {
      break;
    }
    modifiedArray = compareLikesFilter(
      prevAuthor,
      currentAuthor,
      modifiedArray
    );

    newObj = modifiedArray.find((e) => e.author === prevAuthor);

    if (!newObj) {
      authors = authors.filter((e) => e !== prevAuthor);
      prevAuthor = currentAuthor;
    }
  }

  arrayA = blogs.filter((e) => e.author === prevAuthor);
  arrayA.forEach((e) => {
    countA += e.likes;
  });
  arrayB = blogs.filter((e) => e.author === currentAuthor);
  arrayB.forEach((e) => {
    countB += e.likes;
  });
  if (countA >= countB) {
    result = { author: prevAuthor, likes: countA };
  } else {
    result = { author: currentAuthor, likes: countB };
  }

  return result;
};

const list_helper = {
  average,
  dummy,
  reverse,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};

export default list_helper;
