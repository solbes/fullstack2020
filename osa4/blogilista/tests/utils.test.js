const listHelpers = require('../utils/list_helpers')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelpers.dummy(blogs)
  expect(result).toBe(1)
})

const blog1 = {
  _id: '5a422aa71b54a676234d17f8',
  title: 'Go To Statement Considered Harmful',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  likes: 5,
  __v: 0
}

const blog2 = {
  _id: '2',
  title: 'blog 2',
  author: 'kebab',
  url: 'dirlinger',
  likes: 2,
}

describe('total likes', () => {

  test('one blog', () => {
    const result = listHelpers.totalLikes([blog1])
    expect(result).toBe(5)
  })

  test('no blogs', () => {
    const result = listHelpers.totalLikes([])
    expect(result).toBe(0)
  })

  test('two blogs', () => {
    const result = listHelpers.totalLikes([blog1, blog2])
    expect(result).toBe(7)
  })
})

describe('favorite blog', () => {

  test('two blogs', () => {
    const result = listHelpers.favoriteBlog([blog1, blog2])
    expect(result).toEqual(blog1)
  })

  test('one blog', () => {
    const result = listHelpers.favoriteBlog([blog2])
    expect(result).toEqual(blog2)
  })

  test('no blogs', () => {
    const result = listHelpers.favoriteBlog([])
    expect(result).toBe(undefined)
  })
})

describe('most blogs', () => {
  test('one blog', () => {
    const result = listHelpers.mostBlogs([blog1])
    expect(result).toEqual({author: blog1.author, blogs: 1})
  })
  test('many blogs', () => {
    const result = listHelpers.mostBlogs([blog1, blog2, blog2])
    expect(result).toEqual({author: blog2.author, blogs: 2})
  })
  test('no blogs', () => {
    const result = listHelpers.mostBlogs([])
    expect(result).toEqual({author: undefined, blogs: undefined})
  })
})

describe('most likes', () => {
  test('one blog', () => {
    const result = listHelpers.mostLikes([blog1])
    expect(result).toEqual({author: blog1.author, likes: blog1.likes})
  })
  test('many blogs', () => {
    const result = listHelpers.mostLikes([blog1, blog2, blog2, blog2])
    expect(result).toEqual({author: blog2.author, likes: 3*blog2.likes})
  })
  test('no blogs', () => {
    const result = listHelpers.mostLikes([])
    expect(result).toEqual({author: undefined, likes: undefined})
  })
})