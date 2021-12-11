import { validationResult } from "express-validator";
import { ErrorHandler } from "../services/errorService.js";
import tasksService from "../services/tasksService.js";
class TaskController {
    async getFolders(req,res,next) {
        try{
            const {id} = req.user;
            const folders = await tasksService.getFolders(`${id}`);
            return res.json(folders)
        }
        catch(e) {
            next(e)
        }
    }
    async addFolder(req,res,next) {
        const errors = validationResult(req.body);
        if(!errors.isEmpty) {
            next(ErrorHandler.badRequest("bad request","formfields",errors))
        }
        try{
            await tasksService.addFolder({...req.body,id:req.user.id});
            return res.status(200).json({message:"ok"})
        }
        catch(e){
            next(e)
        }
    }
    async deleteFolder(req,res,next) {
        const errors = validationResult(req);
        if(!errors.isEmpty) {
            next(ErrorHandler.badRequest("bad request","formfields",errors))
        }
        try{
            await tasksService.deleteFolder({...req.body,id:req.user.id})
            return res.json({message:"ok"})
        }
        catch(e){
            next(e)
        }
    }
    async changeTitle(req,res,next) {
        const errors = validationResult(req);
        if(!errors.isEmpty) {
            next(ErrorHandler.badRequest("bad request","formfields",errors))
        }
        try {
            const tasks = await tasksService.changeTitle({...req.body,id:req.user.id});
            return res.json({message:"ok",currentValue:req.body.currentValue,tasks})
        }
        catch(e) {
            next(e)
        }
    }
    async addTask(req,res,next) {
        try {
            const {title,task} = req.body;
            await tasksService.addTask(req.user.id,title,task)
            return res.json({message:"ok"})
        }
        catch(e) {
            next(e)
        }
    }
    async toggleTask(req,res,next) {
        try {
            const tasks = await tasksService.toggleTask({...req.body,id:req.user.id})
            return res.json({message:"ok",tasks})
        }
        catch(e) {
            next(e)
        }
    }
    async changeText(req,res,next) {
        try {
            await tasksService.changeText({...req.body,id:req.user.id})
            return res.json({message:"ok"})
        }
        catch(e) {
            next(e)
        }
    }
    async deleteTask(req,res,next) {
        try {
            await tasksService.deleteTask({...req.body,id:req.user.id})
            return res.json({message:"ok"})
        }
        catch(e) {
            next(e)
        }
    }
}
export default new TaskController()