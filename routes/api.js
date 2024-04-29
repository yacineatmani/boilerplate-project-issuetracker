'use strict';

const IssueModel = require("../model").Issue;
const ProjectModel = require("../model").Project;

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(async (req, res) => {
      let projectName = req.params.project;
      try {
        
        const project = await ProjectModel.findOne({ name: projectName });
        if (!project) {
          res.json([{ error: "project not found" }]);
          return;
        } else {
          const issues = await IssueModel.find({
            projectId: project._id,
            ...req.query,
          });
          if (!issues) {
            res.json ([{ error: "issues not found" }]);
          return;
          }
          res.json(issues);
          return;
        }
      } catch (err) {
        res.json({ error: "could not get", _id: _id });
      }
      
    })
    
    .post(async (req, res) => {
      let projectName = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text,
      } = req.body;
      if (!issue_title || !issue_text || !created_by) {
        res.json({ error: "required field(s) missing" });
        return;
      }
      try {
        // Find the project using async/await
        let projectModel = await ProjectModel.findOne({ name: projectName });
        if (!projectModel){
          projectModel = new ProjectModel({ name: projectName });
          projectModel = await projectModel.save();
        }
      const issueModel = new IssueModel({
        projectId: projectModel._id,
        issue_title: issue_title || "",
        issue_text: issue_text || "",
        created_on: new Date(),
        updated_on: new Date(),
        created_by: created_by || "",
        assigned_to: assigned_to || "",
        open: true,
        status_text: status_text || "",
      });
      const issue = await issueModel.save();
      res.json(issue);
    } catch (err) {
      res.json({ error: "could not post", _id: _id });
    }
  })

    
  .put(async (req, res) => {
    let projectName = req.params.project;
    const {
      _id,
      issue_title,
      issue_text,
      created_by,
      assigned_to,
      status_text,
      open,
    } = req.body;
    if (!_id) {
      res.json({ error: "missing _id" });
      return;
    }
    if (
      !issue_title &&
      !issue_text &&
      !created_by &&
      !assigned_to &&
      !status_text &&
      !open
    ) {
      return res.json({ error: "no update field(s) sent", _id: _id });
    }
    
    try {
      // Find the project using async/await
      const projectModel = await ProjectModel.findOne({ name: projectName });
      if (!projectModel){
        throw new Error("project not found");
      }

      const updateObject = {
        ...(issue_title ? { issue_title } : {}),
        ...(issue_text ? { issue_text } : {}),
        ...(created_by ? { created_by } : {}),
        ...(assigned_to ? { assigned_to } : {}),
        ...(status_text ? { status_text } : {}),
        updated_on: new Date(),
        ...(open !== undefined ? { open } : {}), // Update open only if provided
      };
  
      const issue = await IssueModel.findByIdAndUpdate(_id, updateObject, { new: true }); // Set `new: true` to return the updated document
  
      if (!issue) {
        return res.json({ error: "could not update", _id: _id });
      }
  
      res.json({ result: "successfully updated", _id: issue._id });
    } catch (err) {
      console.error(err);
      res.json({ error: "could not update", _id: _id });
    }
  })

  .delete(async (req, res) => {
    const { projectName } = req.params;
    const { _id } = req.body;
  
    if (!_id) {
      return res.json({ error: "missing _id" });
    }
  
    try {
      const deletedIssue = await IssueModel.findByIdAndDelete(_id); // Attempt deletion
  
      if (!deletedIssue) {
        return res.json({ error: "could not delete", _id }); // Issue not found
      }
  
      res.json({ result: "successfully deleted", _id });
    } catch (err) {
      console.error(err);
      res.json({ error: "could not delete", _id }); // Handle other errors
    }
  })
  
    
};
