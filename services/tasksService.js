import { TaskSchema } from "../models/taskSchema.js";
import { ErrorHandler } from "./errorService.js";
import remove  from 'lodash.remove';

class TasksService {
    async getFolders(id) {
        if(!id) throw ErrorHandler.unAuthorizedUser()
        const schemaTask = await getSchemaTask(id)
        if(schemaTask) {
            return schemaTask.tasks
        }
        return {}
    }
    async addFolder(data) {
        const {color,folder,id} = data;
        if(!id) throw ErrorHandler.unAuthorizedUser();
        const schemaTask = await getSchemaTask(id)
        if(!schemaTask) {
            await TaskSchema.create({
                user:id,
                tasks: [
                    {
                        title:folder,
                        color,
                        tasks:[]
                    }
                ]
            })
        } else {
            if(schemaTask.tasks.filter(item=>item.title === folder).length !== 0) {
                throw ErrorHandler.badRequest("Folder with that name already exists","formFields")
            }
            await schemaTask.tasks.push({
                title:folder,
                color,
                tasks:[]
            })
            await schemaTask.save();
        }
    }
    async deleteFolder(data) {
        const {folder,id} = data;
        if(!id) throw ErrorHandler.unAuthorizedUser();
        const schemaTask = await getSchemaTask(id);
        schemaTask.tasks = remove(schemaTask.tasks,(item)=>item.title !== folder)
        await schemaTask.save();
    }
    async changeTitle(body) {
        const {prevValue,currentValue,id} =body;
        const schemaTask = await getSchemaTask(id);
        if(!schemaTask) throw ErrorHandler.unAuthorizedUser();
        const currentTitle = schemaTask.tasks.find(item=>item.title === prevValue);
        if(schemaTask.tasks.find(item=>item.title === currentValue)) {
            throw ErrorHandler.badRequest("folder with that name already exist","task")
        }
        currentTitle.title = currentValue;
        await schemaTask.save();
        return schemaTask.tasks
    }
    async addTask(id,title,task) {
        const schemaTask = await getSchemaTask(id);
        if(!schemaTask) throw ErrorHandler.unAuthorizedUser();
        const currentFolder = getCurrentFolder(schemaTask,title)
        if(currentFolder.tasks.find(item=>item.text===task)) {
            throw ErrorHandler.badRequest("task with that name already exist","task")
        }
        currentFolder.tasks.push({text:task,isCompleted:false})
        await schemaTask.save()
    }
    async toggleTask({id,currentFolder : folderCurrent,task,isCompleted}) {
        const schemaTask = await getSchemaTask(id);
        const currentTask = getCurrentTask(schemaTask,folderCurrent,task)
        currentTask.isCompleted = isCompleted
        await schemaTask.save()
        return schemaTask.tasks
    }
    async changeText({id,folder,valuePrev,valueNext}) {
        const schemaTask = await getSchemaTask(id);
        const currentFolder = getCurrentFolder(schemaTask,folder);
        if(currentFolder.tasks.find(item=>item.text===valueNext)) {
            throw ErrorHandler.badRequest("task with that name already exist","task")
        }
        const currentTask = getCurrentTask(schemaTask,folder,valuePrev);
        currentTask.text = valueNext;
        await schemaTask.save();
    }
    async deleteTask({id,folderCurrent,taskText}) {
        const schemaTask = await getSchemaTask(id);
        const currentFolder = getCurrentFolder(schemaTask,folderCurrent);
        currentFolder.tasks = remove(currentFolder.tasks,item=>item.text !== taskText)
        await schemaTask.save();
    }
}
export default new TasksService()

const getSchemaTask =  async (id) => await TaskSchema.findOne({user:id});
const getCurrentFolder = (schemaTask,folder) => schemaTask.tasks.find(item=>item.title === folder);

const getCurrentTask  = (schemaTask,folder,task) => {
    const currentFolder = schemaTask.tasks.find(item=>item.title === folder);
    return currentFolder.tasks.find(item=>item.text === task);
}