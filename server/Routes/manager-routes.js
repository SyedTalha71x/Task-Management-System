import express from 'express'
import { managerCreateTask, managerDeleteTask, managerViewTasks, managerUpdateTask , getManagerWithAssignedUsers} from '../Controllers /manager-controller.js'
import { roleCheck } from '../Middleware/roleCheck.js';

const router = express.Router();

router.post('/create-task-for-user/:userId', roleCheck('manager'), managerCreateTask)
router.delete('/delete-task-for-user/:taskId', roleCheck('manager'), managerDeleteTask)
router.post('/update-task-for-user/:taskId', roleCheck('manager'), managerUpdateTask)
router.get('/get-task-for-user/:userId', roleCheck('manager'), managerViewTasks)
router.get('/get-assigned-users', roleCheck('manager'), getManagerWithAssignedUsers)



export default router