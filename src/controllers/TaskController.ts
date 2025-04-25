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

    // Obtener tarea por su ID
    static getTaskById = async (req: Request, res: Response) => {
        try {
            
            res.json(req.task)
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }
    // Actualizar Tarea
    static updateTask = async (req: Request, res: Response) => {
        try {
            req.task.name = req.body.name
            req.task.description = req.body.description
            await req.task.save()
            res.send('Tarea Actualizada Correctamemte')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }
    // Eliminar Tarea
    static deleteTask = async (req: Request, res: Response) => {
        try {
            req.project.tasks = req.project.tasks.filter( task => task.toString() !== req.task.id.toString() )
            await Promise.allSettled([req.task.deleteOne(), req.project.save()])
            res.send('Tarea Eliminada Correctamemte')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }
    // Actualizar Status de la tarea
    static updateStatus = async (req: Request, res: Response) => {
        try {
            const { status } = req.body
            req.task.status = status
            await req.task.save()
            res.send('Tarea Actualizada')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }
}