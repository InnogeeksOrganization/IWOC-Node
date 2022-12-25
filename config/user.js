// Schema and Model for User

const mongoose = require('mongoose');

// Login Record
const loginSchema = new mongoose.Schema({
    sessionid: String,
    date: String
});

// Pull Request Record
const prSchema = new mongoose.Schema({
    PR_ID: Number,
    PR_number: Number,
    PR_title: String,
    PR_labels: [String],
    PR_url: String,
    PR_createdAt: String,
    PR_updatedAt: String,
    PR_closedAt: String,
    PR_mergedAt: String
});

// Scoring Record
const scoreSchema = new mongoose.Schema({
    PR_ID: Number,
    PR_title: String,
    projectId: String,
    projectName: String,
    projectDifficulty: String,
    score: Number,
    PR: prSchema,
    author_association: String,
    DBdate: String
}, { timestamps: true });


const userSchema = new mongoose.Schema({
    userid: String,
    displayname: String,
    username: String,
    score: {
        type: Number,
        default: 0
    },
    scoresRecord: {
        type: [scoreSchema],
        default: []
    },
    profileUrl: String,
    avatarUrl: String,
    email: String,
    bio: String,
    blog: String,
    publicRepo: Number,
    followers: Number,
    following: Number,
    sessions: [loginSchema],
}, { timestamps: true });


const User = new mongoose.model('User', userSchema);

module.exports = User;