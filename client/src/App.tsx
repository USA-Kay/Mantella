import { useMemo, useState, createContext } from 'react'
import { Provider } from 'react-redux'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Switch, Route, BrowserRouter } from 'react-router-dom'

import { store } from './store/store'
import { AuthRender } from './components/Auth'
import { CreateProject } from './components/CreateProject'
import { NoMatch } from './components/404/NoMatch'
import { CircularProgress } from '@mui/material'
import { About } from './components/Landing/About'
import { Header } from './components/Header/Header'
import { SnackbarRoot } from './components/SnackbarRoot'
import { Dashboard } from './components/Dashboard'
import { PublicOnlyRoute } from './components/Routing'
import { PrivateRoute } from './components/PrivateRoute'
import { Project } from './components/Project/Project'
import { Settings } from './components/Settings'
import { CalendarWeek } from './components/Calendar/Week'
import { APICookieLogin } from './API/auth'
import { useTheme } from '@mui/material'
import io from 'socket.io-client'
import { useAppDispatch } from './store/hooks'
import { transformUser } from './store/auth'
import { SET_PROJECTS } from './store/projects'
import { LOGIN } from './store/user'

const AllCalendarWeek = () => {
  const theme = useTheme()
  return (
    <div
      style={{
        height: 'calc(100vh - 58.5px)',
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        backgroundImage:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))'
            : undefined
      }}
    >
      <div style={{ padding: '20px 50px 0px 50px' }}>
        <CalendarWeek />
      </div>
    </div>
  )
}

const socket = io('http://localhost:3000', {
  transports: ['websocket', 'polling']
})

const secondary = '#cc1100'
const primary = '#00838f'

export const ColorModeContext = createContext({ toggleColorMode: () => {} })

const Router = () => {
  const [loaded, setLoaded] = useState(false)
  const dispatch = useAppDispatch()

  window.onload = async () => {
    try {
      const loginRes = await APICookieLogin()

      if (loginRes) {
        const authUser = transformUser(loginRes)

        dispatch(LOGIN({ user: authUser }))
        dispatch(SET_PROJECTS(loginRes.projects))
      }

      setLoaded(true)
    } catch (err) {
      setLoaded(true)
    }
  }

  return (
    <BrowserRouter>
      <Header />
      <div style={{ marginTop: 58.5 /* headerHeight */ }} />
      {/* <WelcomeDialog /> */}
      {loaded ? (
        <Switch>
          <PrivateRoute
            exact
            path="/settings"
            component={Settings}
            componentProps={{}}
          />
          <PrivateRoute
            exact
            path="/calendar"
            component={AllCalendarWeek}
            componentProps={{}}
          />
          <PublicOnlyRoute
            exact
            path="/login"
            component={AuthRender}
            componentProps={{ authType: 'Login' }}
          />
          <PublicOnlyRoute
            exact
            path="/register"
            component={AuthRender}
            componentProps={{ authType: 'Register' }}
          />
          <PrivateRoute
            exact
            path="/create-project"
            component={CreateProject}
            componentProps={{}}
          />
          <PrivateRoute
            exact
            path="/project/:id"
            component={Project}
            componentProps={{ socket }}
          />
          <PrivateRoute
            exact
            path="/dashboard"
            component={Dashboard}
            componentProps={{}}
          />
          <PublicOnlyRoute
            exact
            path="/"
            component={About}
            componentProps={() => ({})}
          />
          <Route component={NoMatch} />
        </Switch>
      ) : (
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'space-around'
          }}
        >
          <CircularProgress
            style={{
              width: '128px',
              height: '128px',
              marginRight: 64,
              marginTop: 100
            }}
          />
        </div>
      )}
    </BrowserRouter>
  )
}

export const Wrapper = () => {
  const [mode, setMode] = useState<'light' | 'dark'>('dark')
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
      }
    }),
    []
  )

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: primary
          },
          secondary: {
            main: secondary
          }
        }
      }),
    [mode]
  )

  return (
    <Provider store={store}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <SnackbarRoot />
          <Router />
        </ThemeProvider>
      </ColorModeContext.Provider>
    </Provider>
  )
}
