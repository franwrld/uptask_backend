import { Router } from 'express'
import { body, param } from 'express-validator'
import { ProjectController } from '../controllers/ProjectController'
import { handleInputErrors } from '../middleware/validation'
import { TaskController } from '../controllers/TaskController'
import { projectExists } from '../middleware/project'
import { taskBelongsToProject, taskExists } from '../middleware/task'

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

//Handler Proyecto
router.param('projectId', projectExists)
//Crear Task
router.post('/:projectId/tasks',
    body('name').notEmpty().withMessage('El Nombre de la Tarea es Obligatorio'),
    body('description').notEmpty().withMessage('La Descripcion es Obligatoria'),
    handleInputErrors,
    TaskController.createTask
)
// Obtener Tasks
router.get('/:projectId/tasks',
    TaskController.getProjectTasks
)
//Handlers Task Middleware
router.param('taskId', taskExists)
router.param('taskId', taskBelongsToProject)
// Obtener Task by ID
router.get('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    TaskController.getTaskById
)

// Actualizar Task
router.put('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('ID no válido'),
    body('name')
        .notEmpty().withMessage('El Nombre de la tarea es Obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción de la tarea es obligatoria'),
    handleInputErrors,
    TaskController.updateTask
)

// Eliminar Task
router.delete('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    TaskController.deleteTask
)

// Actualizar Estado de la Tarea
router.post('/:projectId/tasks/:taskId/status',
    param('taskId').isMongoId().withMessage('ID no valido'),
    body('status').notEmpty().withMessage('El estado es obligatorio'),
    handleInputErrors,
    TaskController.updateStatus
)

export default router