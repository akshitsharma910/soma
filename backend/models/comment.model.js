const { readJSON, writeJSON } = require('../utils/fileUtils');
const { v4: uuidv4 } = require('uuid');

const commentsFile = 'comments.json';

class Comment {
    constructor(post, author, content, authorId) {
        this.id = uuidv4();
        this.authorId = authorId;
        this.post = post;
        this.author = author;
        this.content = content;
        this.upvotes = 0;
        this.downvotes = 0;
    }

    static findAll() {
        return readJSON(commentsFile);
    }

    static findByPostId(postId) {
        const comments = readJSON(commentsFile);
        return comments.filter(comment => comment.post === postId);
    }

    static findByCommentId(commentId) {
        const comments = readJSON(commentsFile);
        return comments.find(comment => comment.id === commentId);
    }

    static create({ post, author, content, authorId }) {
        const comments = readJSON(commentsFile);
        const newComment = new Comment(post, author, content, authorId);
        comments.push(newComment);
        writeJSON(commentsFile, comments);
        return newComment;
    }

    static findByIdAndDelete(id) {
        let comments = readJSON(commentsFile);
        comments = comments.filter(comment => comment.id !== id);
        writeJSON(commentsFile, comments);
    }
}

module.exports = Comment;