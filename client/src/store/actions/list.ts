export const setListA = (args: {
  id: string
  projectId: string
  newList: { taskIds?: [string[], string[], string[]]; name?: string } | null
}) => ({
  type: 'SET_LIST',
  id: args.id,
  projectId: args.projectId,
  newList: args.newList
})

export type ListAction = ReturnType<typeof setListA>
