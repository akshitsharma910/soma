const { readJSON, writeJSON } = require('../utils/fileUtils');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const usersFile = 'users.json';

class User {
    constructor(fullName, email, password, picture) {
        this.id = uuidv4();
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.picture = null;
    }

    static findAll() {
        return readJSON(usersFile);
    }

    static findById(id) {
        const users = readJSON(usersFile);
        return users.find(user => user.id === id);
    }

    static findByEmail(email) {
        const users = readJSON(usersFile);
        return users.find(user => user.email === email);
    }

    static async create({ fullName, email, password }) {
        const users = readJSON(usersFile);
        const hashedPass = await bcrypt.hash(password, 10);
        const newUser = new User(fullName, email, hashedPass);
        users.push(newUser);
        writeJSON(usersFile, users);
        return newUser;
    }

    static async update(query, update) {
        const users = await readJSON(usersFile);
        const user = users.find(user => user.id === query.id);
        if (user) {
            if (update.$set && update.$set.picture) {
                user.picture = update.$set.picture;
            }
            writeJSON(usersFile, users);
        }
    }
}

module.exports = User;