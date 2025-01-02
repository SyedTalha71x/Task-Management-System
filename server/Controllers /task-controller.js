import Task from "../Models/task-schema.js";
import { SuccessResponse, FailureResponse } from "../Helper/helper.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, status } = req.body;
    const userId = req.user.userId;
    if (!userId) {
      return FailureResponse(res, "Sorry you are not authorized", null, 400);
    }
    if (!title || !description || !dueDate || !status) {
      return FailureResponse(res, "All Fields are required", null, 400);
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      status,
      creatorId: userId,
    });

    return SuccessResponse(res, "Task has been created", { task }, 200);
  } catch (error) {
    return FailureResponse(res, "Internal Server Error", null, 500);
  }
};
export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, dueDate, status } = req.body;
    const userId = req.user.userId;
    if (!userId) {
      return FailureResponse(res, "Sorry you are not authorized", null, 400);
    }

    let newPayload = {};
    if (title) {
      newPayload.title = title;
    }
    if (description) {
      newPayload.description = description;
    }
    if (dueDate) {
      newPayload.dueDate = dueDate;
    }
    if (status) {
      newPayload.status = status;
    }

    const checkTask = await Task.findById(taskId);
    if (!checkTask) {
      return FailureResponse(res, "Task not found", null, 404);
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { $set: newPayload },
      { new: true }
    );
    return SuccessResponse(res, "Task has been updated", { updatedTask }, 200);
  } catch (error) {
    console.log(error);
    return FailureResponse(res, "Internal Server Error", null, 500);
  }
};
export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.userId;
    if (!userId) {
      return FailureResponse(res, "Sorry you are not authorized", null, 400);
    }
    const checkTask = await Task.findById(taskId);
    if (!checkTask) {
      return FailureResponse(res, "Task not found", null, 404);
    }
    const deleteTask = await Task.findByIdAndDelete(taskId);
    return SuccessResponse(res, "Task has been deleted", { deleteTask }, 200);
  } catch (error) {
    console.log(error);
    return FailureResponse(res, "Internal Server Error", null, 500);
  }
};
export const getAllTasks = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      return FailureResponse(res, "Sorry you are not authorized", null, 400);
    }
    const findTasks = await Task.find({ creatorId: userId });
    if (findTasks.length === 0) {
      return FailureResponse(
        res,
        "No tasks found for the logged-in user",
        null,
        404
      );
    }

    return SuccessResponse(
      res,
      "Fetched all tasks for the logged-in user",
      { findTasks },
      200
    );
  } catch (error) {
    console.log(error);
    return FailureResponse(res, "Internal Server Error", null, 500);
  }
};
export const filterTasks = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status, sort, dueDate } = req.query;

    let query = { creatorId: userId };

    if (status) {
      query.status = status;
    }

    if (dueDate) {
      query.dueDate = new Date(dueDate); 
    }

    let sortCriteria = {};
    if (sort === "asc") {
      sortCriteria.dueDate = 1; 
    } else if (sort === "desc") {
      sortCriteria.dueDate = -1; 
    }

    const tasks = await Task.find(query).sort(sortCriteria);
    if (tasks.length === 0) {
      return SuccessResponse(res, "No tasks found for the given criteria.", { tasks }, 200);
    }

    return SuccessResponse(res, "Success", { tasks }, 200);
  } catch (error) {
    console.error(error);
    return FailureResponse(res, "Internal Server Error", null, 500);
  }
};



