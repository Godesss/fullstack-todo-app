
import express from "express"
import { authMiddle } from "../middlewares/authMiddle.js";
import taskController from "../controllers/tasksController.js"
import { body } from "express-validator";

const router = express.Router()

router.get("/getfolders/",authMiddle,taskController.getFolders)

router.post("/deletefolder",
    authMiddle,
    body("id").isLength({min:6}),   
    taskController.deleteFolder)
router.post("/addfolder",
    authMiddle,
    body("color"),
    body("folder").isLength({min:5}),
    body("id").isLength({min:6}),
    taskController.addFolder)
router.post("/changeTitle",
    authMiddle,
    taskController.changeTitle
)
router.post("/addtask",authMiddle,taskController.addTask)
router.post("/toggletask",authMiddle,taskController.toggleTask)
router.post("/changetext",authMiddle,taskController.changeText)
router.post("/deletetask",authMiddle,taskController.deleteTask)
export default router