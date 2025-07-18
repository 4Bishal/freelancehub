const mongoose = require("mongoose");
const { PostProjectSchema } = require("../schemas/PostProjectSchema");


const ProjectModel = mongoose.model("project", PostProjectSchema);

module.exports = { ProjectModel };