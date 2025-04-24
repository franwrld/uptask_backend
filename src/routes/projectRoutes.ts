import { Router } from 'express'
import { body, param } from 'express-validator'
import { ProjectController } from '../controllers/ProjectController'
import { handleInputErrors } from '../middleware/validation'
import { TaskController } from '../controllers/TaskController'
import { validateProjectExists } from '../middleware/project'

const router = Router()
// Crear Proyecto
router.post('/',
    body('projectName').notEmpty().withMessage('El Nombre del Proyecto es Obligatorio'),
    body('clientName').notEmpty().withMessage('El Nombre del Cliente es Obligatorio'),
    body('description').notEmpty().withMessage('La Descripcion es Obligatoria'),
    handleInputErrors,
    ProjectController.createProject
)
// Obtener todos los proyctos
router.get('/', ProjectController.getAllProjects)
// Obtener Proyecto por su ID
router.get('/:id',
    param('id').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    ProjectController.getProjectById
)
// Actualizar/Update
router.put('/:id',
    param('id').isMongoId().withMessage('ID no valido'),
    body('projectName').notEmpty().withMessage('El Nombre del Proyecto es Obligatorio'),
    body('clientName').notEmpty().withMessage('El Nombre del Cliente es Obligatorio'),
    body('description').notEmpty().withMessage('La Descripcion es Obligatoria'),
    handleInputErrors,
    ProjectController.updateProject
)
// Eliminar/Delete Project
router.delete('/:id',
    param('id').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    ProjectController.deleteProject
)

// Routes for Tareas/Tasks

//Crear Task
router.post('/:projectId/tasks',
    validateProjectExists,
    body('name').notEmpty().withMessage('El Nombre de la Tarea es Obligatorio'),
    body('description').notEmpty().withMessage('La Descripcion es Obligatoria'),
    handleInputErrors,
    TaskController.createTask
)
// Obtener Tasks
router.get('/:projectId/tasks',
    validateProjectExists,
    TaskController.getProjectTasks
)

export default router