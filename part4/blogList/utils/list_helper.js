const lodash = require('lodash')

const dummy = (blogs) => {
    return 1 + blogs.length
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }

    return blogs.length === 0
        ? 0
        : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return 0
    }
    /* Another option using reduce...
    const reducer = (currentMax, item) => {
        return Math.max(currentMax, item.likes)
    }

    const maxLikes = blogs.reduce(reducer, -Infinity)
    */
    const maxLikes = Math.max(...blogs.map(blog => blog.likes))
    const maxLikesIndex = blogs.findIndex(blog => blog.likes === maxLikes)

    return {
        title: blogs[maxLikesIndex].title,
        author: blogs[maxLikesIndex].author,
        likes: blogs[maxLikesIndex].likes
    }
}
// Solution 1, using lodash groupBy
/*
const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return 0
    }

    const authorCount = lodash.groupBy(blogs,(o) => o.author)
    let maxAuthor = ""
    let maxBlogs = 0
    Object.entries(authorCount).forEach(item => {
        if (item[1].length > maxBlogs) {
            maxAuthor = item[0]
            maxBlogs = item[1].length
        }
    })

    return {
        author: maxAuthor,
        blogs: maxBlogs
    }
}
*/
// Solution 2, using lodash countBy
const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return 0
    }

    const authorCount = Object.entries(lodash.countBy(blogs,(o) => o.author))
    const maxBlogs = Math.max(...authorCount.map(i => i[1]))
    const index = authorCount.map(i => i[1]).indexOf(maxBlogs)

    return {
        author: authorCount[index][0],
        blogs: authorCount[index][1]
    }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return 0
    }

    const authorBlogs = lodash.groupBy(blogs,(o) => o.author)
    let maxAuthor = ''
    let maxLikes = 0
    let authorLikes = 0
    Object.entries(authorBlogs).forEach(item => {
        item[1].forEach(o => {
            authorLikes += o.likes
        })
        if (authorLikes > maxLikes) {
            maxAuthor = item[0]
            maxLikes = authorLikes
        }
        authorLikes = 0
    })

    return {
        author: maxAuthor,
        likes: maxLikes
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}