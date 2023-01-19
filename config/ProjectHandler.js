const {Octokit} = require('octokit');
const Project = require('./project');
const mongoose = require('mongoose');
require('dotenv').config();

const octokit = new Octokit({auth:process.env.GIT_TOKEN});

const addProject = async function (data){

    let ownerId = "",repoName = "";
    const repo = data.repoUrl.split("/");
  
    if(repo[0] == "https:" || repo[0] == "http:"){
      ownerId = repo[3];
      repoName = repo[4];
    }
    else{
      ownerId = repo[1];
      repoName = repo[2];
    }
    
    console.log(ownerId,repoName);
    const resp = await octokit.request('GET /repos/{owner}/{repo}', {
      owner: ownerId,
      repo: repoName
    })
  
    //console.log(resp);
    
    let projects = await Project.findOne({projectId: resp.data.id});
    console.log(projects);
    if(projects == null){
      await Project.create({
        projectId: 0,
        projectName: data.projectName,
        projectDesc: data.description,
        repoId: resp.data.id,
        repoName:resp.data.name,
        repoUrl:resp.data.html_url,
        repoDesc:resp.data.description,
        language: [resp.data.language],
        topic: resp.data.topic,
        open_issues: resp.data.open_issues,
        stars: resp.data.stargrazers_count,
        difficulty: "Intermediate",
        owner: {
            ownerName: data.name,
            ownerEmail: data.email,
            ownerPhone: data.phone,
            ownerLib: data.libid,
            ownerId: resp.data.owner.id,
            ownerUsername: resp.data.owner.login,
            avatar_url: resp.data.owner.avatar_url,
            profile_url: resp.data.owner.html_url
        },
        repo_created_at:new Date(resp.data.created_at).toLocaleString('en-IN',{timeZone:'Asia/Kolkata'}),
        repo_updated_at:new Date(resp.data.updated_at).toLocaleString('en-IN',{timeZone:'Asia/Kolkata'}),
        repo_pushed_at:new Date(resp.data.pushed_at).toLocaleString('en-IN',{timeZone:'Asia/Kolkata'}),
        date: new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'})
      });
    }

    projects = await Project.find({projectId: resp.data.id});
    console.log(projects);
  }

module.exports = {addProject};