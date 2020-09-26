const dummy = (blogs) => {
  return 1
}

const arrSum = arr => arr.reduce((a,b) => a + b, 0)
const argMax = arr => arr.indexOf(Math.max(...arr))

const totalLikes = (blogs) => {
  likes = blogs.map(blog => blog.likes)
  return arrSum(likes)
}

const favoriteBlog = (blogs) => {
  likes = blogs.map(blog => blog.likes)
  iMax = argMax(likes)
  return blogs[iMax]
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}