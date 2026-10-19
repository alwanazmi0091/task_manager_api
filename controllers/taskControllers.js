import Tasks from "../models/taskModels.js";

const getTasks = async (req, res) => {
  const userId = req.session.userId;

  const result = await Tasks.get(userId);

  return res.status(200).json(result);
};

const getTaskById = async (req, res) => {
  const taskId = req.params.id;
  const userId = req.session.userId;

  const task = await Tasks.findById(taskId, userId);
  if (!task) {
    return res.status(404).json({
      message: "Task doesn't exist",
    });
  }

  return res.status(200).json(task);
};

const createTask = async (req, res) => {
  const userId = req.session.userId;

  if (Object.keys(req.body)[0] !== "task") {
    return res.status(400).json({
      message: "Invalid field",
    });
  }

  if (
    Object.keys(req.body).length === 0 ||
    typeof req.body.task !== "string" ||
    req.body.task.trim() === ""
  ) {
    return res.status(400).json({
      message: "Task cannot be empty and must be string",
    });
  }

  const normalizedTask = req.body.task.trim();

  const result = await Tasks.create(normalizedTask, userId);

  return res.status(201).json({
    message: "Sucessfully created task",
    insertId: result,
  });
};

const editTask = async (req, res) => {
  const userId = req.session.userId;
  const taskId = req.params.id;

  if (
    Object.keys(req.body)[0] !== "task" ||
    Object.keys(req.body).length !== 1
  ) {
    return res.status(400).json({
      message: "Invalid field",
    });
  }

  if (
    Object.keys(req.body).length === 0 ||
    typeof req.body.task !== "string" ||
    req.body.task.trim() === ""
  ) {
    return res.status(400).json({
      message: "Task cannot be empty and must be string",
    });
  }

  const normalizedTask = req.body.task.trim();

  const task = await Tasks.findById(taskId, userId);

  if (!task) {
    return res.status(404).json({
      message: "Task doesn't exist",
    });
  }

  if (normalizedTask === task.task_content) {
    return res.status(200).json({
      message: "Successfully edited task",
    });
  }

  await Tasks.edit(normalizedTask, taskId, userId);

  return res.status(200).json({
    message: "Successfully edited task",
  });
};

const deleteTask = async (req, res) => {
  const taskId = req.params.id;
  const userId = req.session.userId;

  const result = await Tasks.delete(taskId, userId);
  if (!result) {
    return res.status(404).json({
      message: "Task doesn't exist",
    });
  }

  return res.status(200).json({
    message: "Successfully deleted task",
  });
};

export { getTasks, getTaskById, createTask, editTask, deleteTask };
