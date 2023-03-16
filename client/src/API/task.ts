import axios from 'axios'
import { TTask } from '../types/project'

export const APICreateTask = async (
  projId: string,
  listId: string,
  taskInfo: any
) => {
  const res = await axios.post('/createTask', { projId, listId, taskInfo })

  return res.data
}

export type DragTaskInfo = {
  projectId: string
  oldListId: string
  newListId: string
  id: string
  newProgress: number
  oldProgress: number
  newIndex: number
}

export const APIDragTask = async (info: DragTaskInfo) => {
  const res = await axios.post('/dragTask', info)
  return res.data
}

export const APIEditTask = async (newTask: TTask, projectId: string) => {
  const res = await axios.post('/editTask', {
    taskId: newTask.id,
    task: newTask,
    projId: projectId
  })

  return res.data
}

export const APIAssignUserToTask = async ({
  taskId,
  projId,
  userId
}: {
  taskId: string
  projId: string
  userId: string
}) => {
  const { data } = await axios.post('/assignUserToTask', {
    taskId,
    projId,
    userId
  })

  return data.task
}
