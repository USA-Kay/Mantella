import { Button, Paper } from '@mui/material'
import { connect } from 'react-redux'
import {
  resetPomodoroA,
  setTimeDevA,
  toggleSelectingTaskA
} from '../../store/actions/pomodoro'
import { TState } from '../../types/state'
import { getAllTasks, id } from '../../utils/utilities'

type ActionCreators = typeof actionCreators

interface TProps extends ReturnType<typeof mapState>, ActionCreators {
  toggleWorking: () => void
  timeLeft: string
}

const CDisplay = (props: TProps) => {
  const { pomodoro, timeLeft } = props
  const buttonText = `${pomodoro.paused ? 'Start' : 'Stop'} ${
    pomodoro.working ? 'Work' : 'Break'
  }`
  return (
    <div style={{ margin: 10 }}>
      <div
        style={{
          color: pomodoro.working ? 'red' : 'green',
          textAlign: 'center',
          fontSize: 24
        }}
      >
        {timeLeft}
      </div>
      <Paper
        style={{
          minHeight: 36,
          marginBottom: 10,
          marginTop: 5,
          backgroundColor: 'white',
          padding: 10
        }}
      >
        <p style={{ display: 'inline', fontSize: 20 }}>
          {
            pomodoro.selectingTask
              ? 'Selecting Task...'
              : pomodoro.selectedTaskId
              ? props.tasks[id(props.tasks, pomodoro.selectedTaskId!)].name
              : 'Select Task'
            /* ? tasks[pomodoro.selectedTaskId].name : 'No Task Selected'} */
          }
        </p>
        <Button
          color="secondary"
          style={{ float: 'right', marginLeft: 5 }}
          onClick={() => props.toggleSelectingTask()}
        >
          {pomodoro.selectingTask
            ? 'Cancel'
            : 'Select ' + (pomodoro.selectedTaskId ? 'New' : '')}
        </Button>
        <p>
          {pomodoro.selectedTaskId && !pomodoro.selectingTask
            ? '' // toDaysHHMMSS(tasks[pomodoro.selectedTaskId].timeWorkedOn)
            : ''}
        </p>
      </Paper>
      <div style={{ display: 'flex' }}>
        <Button
          onClick={props.toggleWorking}
          color="primary"
          fullWidth
          variant="outlined"
        >
          {buttonText}
        </Button>
        <div style={{ width: 8 }} />
        <Button onClick={props.reset} color="secondary" fullWidth>
          Reset
        </Button>
      </div>
    </div>
  )
}

const mapState = (state: TState) => ({
  pomodoro: state.pomodoro,
  tasks: getAllTasks(state.projects)
})

const actionCreators = {
  reset: resetPomodoroA,
  toggleSelectingTask: toggleSelectingTaskA,
  setTimeDev: setTimeDevA
}

export const Display = connect(mapState, actionCreators)(CDisplay)
