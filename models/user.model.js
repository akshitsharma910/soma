const { readJSON, writeJSON } = require('../utils/fileUtils');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

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

    static async update(query) {
        const users = await readJSON(usersFile);
        const user = users.find(user => user.id === query.id);
        if (user) {
            if (query.picture) {
                const userDir = path.join(__dirname, '..', 'public', 'userData', user.id);
                if (!fs.existsSync(userDir)) {
                    fs.mkdirSync(userDir, { recursive: true });
                }

                const picturePath = path.join(userDir, path.basename(query.picture));
                fs.copyFileSync(query.picture, picturePath);

                user.picture = picturePath;
            }
            if (query.fullName) {
            user.fullName = query.fullName;
            }
            if (query.email) {
            user.email = query.email;
            }
            if (query.password) {
            user.password = query.password;
            }
            writeJSON(usersFile, users);
        }
    }
}

module.exports = User;