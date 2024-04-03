const express = require("express");
const router = express.Router();

const {
  getAllJobs,
  getJob,
  editJob,
  createJob,
  deleteJob,
} = require("../controllers/jobs");

router.route("/").post(createJob).get(getAllJobs);
router.route("/:id").delete(deleteJob).get(getJob).patch(editJob);

module.exports = router;
