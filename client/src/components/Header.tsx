import React, { useState } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import MenuIcon from '@material-ui/icons/Menu'
import {
  Theme,
  WithStyles,
  createStyles,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Drawer,
  Tab,
  Avatar,
  Tooltip,
  Button,
  Menu,
  Typography,
  Grid,
  Toolbar,
  AppBar,
  Tabs
} from '@material-ui/core'
import { Trail } from 'react-spring/renderprops'
import {
  HowToReg,
  CalendarToday,
  Help,
  Settings,
  Home
} from '@material-ui/icons'
import { Link as NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { TState } from '../types/state'
import { ProjectFinder } from './ProjectFinder/ProjectFinder'

/**
 * @todo Refresh changing tab is kinda slow
 */

const noAuthItems = [
  {
    label: 'About',
    pathname: '/',
    menuIcon: Help
  },
  {
    label: 'Login',
    pathname: '/login',
    menuIcon: HowToReg
  },
  {
    label: 'Register',
    pathname: '/register',
    menuIcon: HowToReg
  }
]

const authItems = [
  { label: 'Home', pathname: '/dashboard', menuIcon: Home },
  { label: 'Settings', pathname: '/settings', menuIcon: Settings },
  {
    label: 'Calendar',
    pathname: '/calendar',
    menuIcon: CalendarToday
  }
]

const styles = (theme: Theme) =>
  createStyles({
    appBar: {
      position: 'relative',
      boxShadow: 'none',
      borderBottom: `1px solid ${theme.palette.grey['100']}`,
      backgroundColor: 'white'
    },
    inline: {
      display: 'inline'
    },
    flex: {
      display: 'flex'
    },
    link: {
      textDecoration: 'none',
      color: 'inherit'
    },
    tagline: {
      display: 'inline-block',
      marginLeft: 10
    },
    iconContainer: {
      display: 'none',
      [theme.breakpoints.down('md')]: {
        display: 'block',
        marginLeft: 'auto'
      }
    },
    tabContainer: {
      marginLeft: 'auto',
      [theme.breakpoints.down('md')]: {
        display: 'none'
      }
    },
    tabItem: {
      paddingTop: 20,
      paddingBottom: 20,
      minWidth: 'auto'
    },
    iconButton: {}
  })

type TProps = WithStyles<typeof styles> &
  RouteComponentProps &
  ReturnType<typeof mapState>

const Topbar = (props: TProps) => {
  const [drawer, setDrawer] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null as any)

  const { classes } = props

  const MenuItems = props.authenticated !== null ? authItems : noAuthItems

  const value = MenuItems.map((menuItem) => menuItem.pathname).indexOf(
    props.location.pathname
  )

  return (
    <>
      <AppBar position="absolute" color="default" className={classes.appBar}>
        <Toolbar style={{ minHeight: 64, padding: '0px 24px' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid
              item
              xs={12}
              style={{ alignItems: 'center' }}
              className={classes.flex}
            >
              {props.authenticated !== null && (
                <>
                  <Button
                    style={{
                      margin: 'auto 25px auto 0px',
                      paddingTop: 8,
                      paddingBottom: 8
                    }}
                    color="primary"
                    variant="outlined"
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                  >
                    <MenuIcon />
                    <span style={{ marginLeft: 5 }}>Projects</span>
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                  >
                    <div style={{ outline: 'none', margin: 10 }}>
                      <ProjectFinder variant="menu" />
                    </div>
                  </Menu>
                </>
              )}
              <div className={classes.inline}>
                <Typography variant="h6" color="inherit" noWrap>
                  <Trail
                    items={'Kanban Brawn'}
                    from={{ transform: 'translate3d(0,-40px,0)' }}
                    to={{ transform: 'translate3d(0,0px,0)' }}
                  >
                    {(item) => (trailProps) =>
                      (
                        <a
                          target="_blank"
                          rel="noreferrer"
                          href="https://github.com/austin-UW/Mantella"
                          style={{
                            ...trailProps,
                            color: 'black',
                            textDecoration: 'none',
                            paddingRight: 5
                          }}
                          className={classes.tagline}
                        >
                          Mantella
                        </a>
                      )}
                  </Trail>
                </Typography>
              </div>
              <React.Fragment>
                <div className={classes.iconContainer}>
                  <IconButton
                    onClick={() => setDrawer(true)}
                    className={classes.iconButton}
                  >
                    <MenuIcon />
                  </IconButton>
                </div>

                <div className={classes.tabContainer}>
                  <Tabs
                    value={value === -1 ? false : value}
                    indicatorColor="primary"
                    textColor="primary"
                  >
                    {MenuItems.map((item, index) => (
                      <Tab
                        disabled={location.hash.slice(1) === item.pathname}
                        style={{ minWidth: 96 }}
                        key={index}
                        to={item.pathname}
                        component={NavLink}
                        classes={{ root: classes.tabItem }}
                        label={item.label}
                      />
                    ))}
                  </Tabs>
                </div>

                {props.authenticated !== null && (
                  <>
                    <Tooltip title={`${props.authenticated.username}`}>
                      <Avatar
                        style={{
                          margin: 'auto 10px',
                          backgroundColor: '#0061ff'
                        }}
                      >
                        {props.authenticated.username[0].toUpperCase()}
                      </Avatar>
                    </Tooltip>
                  </>
                )}
              </React.Fragment>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Drawer anchor="right" open={drawer} onClose={() => setDrawer(false)}>
        <div style={{ width: 'auto' }}>
          <List>
            {MenuItems.map((menuItem, index) => (
              <ListItem
                onClick={() => setDrawer(false)}
                to={menuItem.pathname}
                component={NavLink}
                button
                key={index}
              >
                <ListItemIcon>
                  <menuItem.menuIcon />
                </ListItemIcon>
                <ListItemText primary={menuItem.label} />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
    </>
  )
}

const mapState = (state: TState) => ({
  authenticated: state.user
})

const Routed = withRouter(connect(mapState)(Topbar))

export const Header = withStyles(styles)(Routed)
