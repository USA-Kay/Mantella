import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material'
import { Check, Close, Traffic } from '@mui/icons-material'
import { CSSProperties } from 'react'

const tableHeadData: string[] = ['Feature', 'Mantella', 'Trello', 'KanbanFlow']
const features = [
  ['Swimlanes', 'CHECK', 'NO', 'PRO'],
  ['Pomodoro Timer', 'CHECK', 'NO', 'Extensions'],
  ['Time Management Integration', 'CHECK', 'NO', 'Extensions'],
  ['Subtasks', 'CHECK', 'CHECK', 'CHECK'],
  ['Filtering', 'CHECK', 'CHECK', 'CHECK'],
  ['Recurring Tasks', 'WIP', 'CHECK', 'CHECK'],
  ['Collapse Columns', 'CHECK', 'CHECK', 'NO'],
  ['Mobile Friendly', 'WIP', 'CHECK', 'CHECK'],
  ['Attach Photos', 'WIP', 'PRO', 'CHECK'],
  ['Comments', 'CHECK', 'NO', 'CHECK'],
  ['Links', 'WIP', 'NO', 'CHECK']
]

const styles = {
  paper: {
    maxWidth: 1000,
    margin: '20px 0',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: 16,
    paddingBottom: 48
  } as CSSProperties
}

export const FeatureTable = () => (
  <Paper style={styles.paper}>
    <Table>
      <TableHead>
        <TableRow>
          {tableHeadData.map((val, i) => (
            <TableCell key={i}>{val}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {features.map((feature, i) => (
          <TableRow key={i}>
            {feature.map((val, e) => (
              <TableCell key={e}>
                {val === 'CHECK' ? (
                  <Check style={{ color: '#00CC00' }} />
                ) : val === 'NO' ? (
                  <Close style={{ color: '#cc0000' }} />
                ) : val === 'WIP' ? (
                  <Traffic style={{ color: 'orange' }} />
                ) : val === 'PRO' ? (
                  'Premium'
                ) : (
                  val
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Paper>
)
