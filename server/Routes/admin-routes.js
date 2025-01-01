import { addUser, assignUsersToManager, editUser, deleteUser, viewAllUsers, viewUserTasks, updateTask, deleteTask, getManagers, getUsers} from "../Controllers /admin-controller.js";
import express from 'express'
import { roleCheck } from "../Middleware/roleCheck.js";

const router = express.Router();

router.post('/add-user', roleCheck('admin'), addUser)
router.put('/edit-user/:id', roleCheck('admin'), editUser)
router.delete('/delete-user/:id',  roleCheck('admin'), deleteUser)
router.get('/view-all-users', roleCheck('admin'), viewAllUsers)
router.post('/assign-users-to-manager',  roleCheck('admin'), assignUsersToManager)
router.get('/view-user-tasks/:userId',  roleCheck('admin'), viewUserTasks)
router.post('/update-user-task/:taskId',  roleCheck('admin'), updateTask)
router.delete('/delete-user-task/:taskId',  roleCheck('admin'), deleteTask)
router.get('/get-users-only',  roleCheck('admin'), getUsers)
router.get('/get-managers-only',  roleCheck('admin'), getManagers)





export default router