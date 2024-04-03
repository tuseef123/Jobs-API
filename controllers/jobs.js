const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const getAllJobs = async (req, res) => {
  const user = req.user.userId;
  const jobs = await Job.find({ createdBy: user }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  const user = req.user.userId;
  const jobId = req.params.id;
  // const {user:{userId},param}
  const job = await Job.findOne({ _id: jobId, createdBy: user });
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);

  res.status(StatusCodes.CREATED).json({ job });
};

const editJob = async (req, res) => {
  const jobId = req.params.id;
  const user = req.user.userId;
  const { company, position } = req.body;
  if (company === "" || position === "") {
    throw new BadRequestError("Company or position cannot be empty");
  }
  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: user },
    req.body,
    { new: true, runValidators: true }
  );
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const user = req.user.userId;
  const jobId = req.params.id;
  const job = await Job.findByIdAndDelete({ _id: jobId, createdBy: user });
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ msg: "Job was deleted" });
};

module.exports = {
  getAllJobs,
  getJob,
  editJob,
  createJob,
  deleteJob,
};
