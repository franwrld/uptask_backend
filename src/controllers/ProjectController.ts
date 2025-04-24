import type { Request, Response } from "express"
import Project from "../models/Project"
import { param } from "express-validator"
import { Error } from "mongoose"

export class ProjectController {
    // Crear proyecto
    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body)
        
        try {
            await project.save()
            res.send('Proyecto creado correctamente')
        } catch (error) {
            console.log(error)
        }
    }
    // Obtener todos los proyectos
    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find({})
            res.json(projects)
        } catch (error) {
            console.log(error)
        }
    }
    // Obtener Project por su ID
    static getProjectById = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const project = await (await Project.findById(id)).populate('tasks')

            if(!project) {
                const error = new Error('Proyecto no encontrado')
                return res.status(404).json({error: error.message})
            }
            res.json(project)
        } catch (error) {
            console.log(error)
        }
    }
    // Actualizar/Update Project
    static updateProject = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const project = await Project.findByIdAndUpdate(id, req.body)

            if(!project) {
                const error = new Error('Proyecto no encontrado')
                return res.status(404).json({error: error.message})
            }

            await project.save()
            res.send('Proyecto Actualizado')
        } catch (error) {
            console.log(error)
        }
    }
    // Eliminar/Delete Project
    static deleteProject = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const project = await Project.findById(id)

            if(!project) {
                const error = new Error('Proyecto no encontrado')
                return res.status(404).json({error: error.message})
            }

            await project.deleteOne()
            res.send('Proyecto Eliminado')
        } catch (error) {
            console.log(error)
        }
    }
}