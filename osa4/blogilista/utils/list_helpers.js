const dummy = (blogs) => {
  return 1
}

const arrSum = arr => arr.reduce((a,b) => a + b, 0)
const argMax = arr => arr.indexOf(Math.max(...arr))

const unique = arr => {
  reducer = (x,y) => (x.includes(y) ? x : x.concat(y))
  return arr.reduce(reducer, [])
}

const totalLikes = (blogs) => {
  likes = blogs.map(blog => blog.likes)
  return arrSum(likes)
}

const favoriteBlog = (blogs) => {
  likes = blogs.map(blog => blog.likes)
  iMax = argMax(likes)
  return blogs[iMax]
}

const mostBlogs = (blogs) => {
  authors = blogs.map(b => b.author)
  authors_uniq = unique(authors)
  num_blogs = authors_uniq.map(
    author => authors.filter(a => a === author).length
  )

  iMax = argMax(num_blogs)
  return { author: authors_uniq[iMax], blogs: num_blogs[iMax] }
}

const mostLikes = (blogs) => {
  authors = blogs.map(b => b.author)
  authors_uniq = unique(authors)
  num_likes = authors_uniq.map(
    author => arrSum(blogs.filter(b => b.author === author).map(b => b.likes))
  )

  iMax = argMax(num_likes)
  return { author: authors_uniq[iMax], likes: num_likes[iMax] }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}