const express = require("express");
const router = express.Router();
const ProjectModel = require("../ProjectModel");
const { isValidObjectId } = require("mongoose");

// NOTE: For in memory
// const { v4 } = require("uuid");
// const projects = [];

router.post("/", async (req, res) => {
  const { title, description, owner, department } = req.body;
  // const project = { id: v4(), ...req.body };
  // projects.push(project);
  // res.json(project);

  try {
    if (
      typeof title !== "string" ||
      typeof description !== "string" ||
      typeof owner !== "string" ||
      typeof department !== "string"
    ) {
      sendError(res);
      return;
    }
    const project = await ProjectModel.create({
      title,
      description,
      owner,
      department,
    });

    res.json(project);
  } catch (e) {
    console.log(e);
    sendError(res);
  }
});

function sendError(res) {
  res.status(500).json({
    message: "Unable to create project",
  });
}

router.get("/", async (req, res) => {
  // res.json(projects);
  try {
    const projects = await ProjectModel.find({}).sort({ _id: -1 });
    res.json(projects);
  } catch (error) {
    console.log(error);
    sendError(res);
  }
});

router.patch("/", async (req, res) => {
  try {
    const { title, description, owner, department, _id } = req.body;
    if (
      typeof title !== "string" ||
      typeof description !== "string" ||
      typeof owner !== "string" ||
      typeof department !== "string" ||
      !isValidObjectId(_id)
    ) {
      sendError(res);
      return;
    }
    const updateResult = await ProjectModel.updateOne(
      { _id },
      {
        $set: {
          title,
          description,
          owner,
          department,
        },
      }
    );
    // for (let i = 0; i < projects.length; i++) {
    //   if (projects[i].id === req.body.id) {
    //     projects[i] = req.body;
    //   }
    // }
    if (updateResult.modifiedCount > 0) {
      res.json({ message: "Successful" });
    } else {
      res.status(400).json({
        message: "Unable to update",
      });
    }
  } catch (error) {
    console.log(error);
    sendError(res);
  }
});

module.exports = router;
