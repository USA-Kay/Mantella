import { v4 as uuid } from 'uuid'
import { ProjectModel } from '../models/Project'
import {
  createColummRes,
  createColumnReq,
  deleteColumnReq,
  deleteColumnRes,
  toggleCollapsedReq,
  toggleCollapsedRes
} from './types'
import { router } from './router'
import { isAuthenticated } from '../passport'

export const createColumn = async (
  req: createColumnReq,
  res: createColummRes
) => {
  const creatingId = uuid()

  const project = await ProjectModel.findOne({ id: req.body.projId })

  if (!req.user || !project) {
    throw new Error('Error creating column')
  }

  project.columns.push({
    inProgress: false,
    id: creatingId,
    name: req.body.name,
    collapsedUsers: [],
    taskIds: []
  })
  const newProject = await project.save()
  res.json({
    project: newProject,
    column: newProject.columns.find((col) => col.id === creatingId)
  })
}

router.post('/createColumn', isAuthenticated, createColumn)

export const toggleCollapsed = async (
  req: toggleCollapsedReq,
  res: toggleCollapsedRes
) => {
  const project = await ProjectModel.findOne({ id: req.body.projId })

  if (req.user && project) {
    const col = project.columns.find((col) => col.id === req.body.colId)
    if (col) {
      const userIdInCollapsed = col.collapsedUsers.indexOf((req.user as any).id)
      if (userIdInCollapsed > -1) {
        // user has column collapsed
        col.collapsedUsers.splice(userIdInCollapsed, 1)
      } else {
        col.collapsedUsers = [...col.collapsedUsers, (req.user as any).id]
      }
      const newProj = await project.save()

      res.json({ column: col, project: newProj })
    }
    throw new Error('column does not exist')
  } else {
    throw new Error('user id not provided')
  }
}

router.post('/toggleCollapsed', isAuthenticated, toggleCollapsed)

export const deleteColumn = async (
  req: deleteColumnReq,
  res: deleteColumnRes
) => {
  const project = await ProjectModel.findOne({ id: req.body.projId })
  if (project) {
    if (project.columns.length <= 1) {
      throw new Error('trying to delete last column')
    }
    if (project.columns.find((col) => col.id === req.body.colId)!.inProgress) {
      throw new Error('Trying to delete in progress column')
    }
    project.columns = project.columns.filter((col) => col.id !== req.body.colId)
    await project.save()
    res.json({ id: req.body.colId })
  } else {
    throw new Error('project no longer exists')
  }
}

router.post('/deleteColumn', isAuthenticated, deleteColumn)
