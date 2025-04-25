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
            const {taskId} = req.params
            const task = await Task.findById(taskId)
            if(!task) {
                const error = new Error('Tarea no encontrada')
                return res.status(404).json({error: error.message})
            }
            // Si la tarea no pertenece a ese proyecto
            if(task.project.toString() !== req.project.id) {
                const error = new Error('Accion no valida')
                return res.status(400).json({error: error.message})
            }
            res.json(task)
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }
    // Actualizar Tarea
    static updateTask = async (req: Request, res: Response) => {
        try {
            const {taskId} = req.params
            const task = await Task.findById(taskId)
            if(!task) {
                const error = new Error('Tarea no encontrada')
                return res.status(404).json({error: error.message})
            }
            // Si la tarea no pertenece a ese proyecto
            if(task.project.toString() !== req.project.id) {
                const error = new Error('Accion no valida')
                return res.status(400).json({error: error.message})
            }
            task.name = req.body.name
            task.description = req.body.description
            await task.save()
            res.send('Tarea Actualizada Correctamemte')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }
    // Eliminar Tarea
    static deleteTask = async (req: Request, res: Response) => {
        try {
            const { taskId } = req.params
            const task = await Task.findById(taskId, req.body)
            if(!task) {
                const error = new Error('Tarea no encontrada')
                return res.status(404).json({error: error.message})
            }
            
            req.project.tasks = req.project.tasks.filter( task => task.toString() !== taskId)
            await Promise.allSettled([task.deleteOne(), req.project.save()])
            res.send('Tarea Eliminada Correctamemte')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }
}