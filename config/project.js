const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
    ownerName: String,
    ownerEmail: String,
    ownerPhone: String,
    ownerId: String,
    ownerUsername: String,
    avatar_url: String,
    profile_url: String,
});


const projectSchema = new mongoose.Schema({
    projectId: Number,
    projectName: String,
    projectDesc: String,
    repoId: String,
    repoName:String,
    repoUrl:String,
    repoDesc:String,
    language: [String],
    topic: [String],
    open_issues: Number,
    stars: Number,
    difficulty: String,
    owner: ownerSchema,
    repo_created_at:String,
    repo_updated_at:String,
    repo_pushed_at:String,
    date: String
},{timestamps:true});


const Project = new mongoose.model('Project',projectSchema);

module.exports = Project;