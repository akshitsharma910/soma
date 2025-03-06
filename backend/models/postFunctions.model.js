const { readJSON, writeJSON } = require('../utils/fileUtils');
const { v4: uuidv4 } = require('uuid');

const postsFile = 'posts.json';

class Post {
    constructor(title, content, genre, author, authorId) {
        this.id = uuidv4();
        this.authorId = authorId;
        this.title = title;
        this.content = content;
        this.genre = genre;
        this.author = author;
        this.comments = [];
        this.upvotes = 0;
        this.downvotes = 0;
    }

    static findAll() {
        return readJSON(postsFile);
    }

    static findByAuthorId(id) {
        const posts = readJSON(postsFile);
        return posts.filter(post => post.authorId === id);
    }

    static findById(id) {
        const posts = readJSON(postsFile);
        return posts.find(post => post.id === id);
    }

    static create({ title, content, genre, author, authorId }) {
        const posts = readJSON(postsFile);
        const newPost = new Post(title, content, genre, author, authorId);
        posts.push(newPost);
        writeJSON(postsFile, posts);
        return newPost;
    }

    static deleteById(id) {
        let posts = readJSON(postsFile);
        posts = posts.filter(post => post.id !== id);
        writeJSON(postsFile, posts);
    }

    static addComment(postId, comment) {
        const posts = readJSON(postsFile);
        const post = posts.find(post => post.id === postId);
        if (post) {
            post.comments.push(comment);
            writeJSON(postsFile, posts);
        }
    }

    static async update(query, update) {
        const posts = await readJSON(postsFile);
        const post = posts.find(post => post.id === query.id);
        if (post) {
            if (update.$pull && update.$pull.comments) {
                post.comments = post.comments.filter(comment => comment.id !== update.$pull.comments.id);
            }
            await writeJSON(postsFile, posts);
        }
    }
}

module.exports = Post;