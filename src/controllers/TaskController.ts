import type { Request, Response } from "express";

import Task from "../models/Task";

export class TaskController {
    // Crear tareas
    static createTask = async (req: Request, res: Response) => {
        try {
            const task = new Task(req.body)
            // Asignarle el proyecto al que pertenece la tarea
            task.project = req.project.id
            // Asignar tarea al project
            req.project.tasks.push(task.id)
            // Guardar
            await Promise.allSettled([task.save(), req.project.save()])
            res.send('Tarea creada correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }
    // Obtener las tareas del proyecto
    static getProjectTasks = async (req: Request, res: Response) => {
        try {
            const tasks = await Task.find({project: req.project.id}).populate('project')
            res.json(tasks)
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }
}