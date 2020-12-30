import React, { Suspense } from "react"
import { ErrorBoundary } from "components/ErrorBoundary"
import loadable from "@loadable/component"
import { Flex, Box, useBreakpoint } from "@chakra-ui/react"
import { Switch, useRouteMatch, Route } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { AppState } from "store"
import { getChurch } from 'store/System/actions'
import useToast from "utils/Toast"
import { Dashboard } from "components/Dashboard"
import { DashboardHeader } from "components/DashboardHeader"
import { makeStyles, createStyles } from "@material-ui/styles"
import { TransitionGroup, Transition,CSSTransition } from "react-transition-group"
import { Wrapper } from "components/Wrapper"
import { exit, play } from "utils/transitionPlay"

//#region 
import { Media } from "views/Media"
import { Activity } from "views/ChurchActivity/Activity"
const Group = loadable(() => import('views/Groups/Group'))
const GroupCreate = loadable(() => import('views/Groups/Create/Create'))
const DashboardView = loadable(() => import('views/Dashboard/Dashboard'))
const MediaCreate = loadable(() => import("views/Media/Create"))
const EventCreate = loadable(() => import("views/ChurchActivity/Activity/EventCreate"))
const ActivityCreate = loadable(() => import('views/ChurchActivity/Activity/Create/Create'))
const Ads = loadable(() => import("views/Ads/Ads"))
const AdsCreate = loadable(() => import("views/Ads/Create/Create"))
const Subscription = loadable(() => import("views/Subscription/Subscription"))
const Finance = loadable(() => import("views/Finance/Finance"))
const Report = loadable(() => import("views/Reports/Reports"))
const UserManager = loadable(() => import("views/UserManager/UserManager"))
const RoleCreate = loadable(() => import("views/UserManager/Manage/Create"))
const RoleEdit = loadable(() => import("views/UserManager/Manage/Edit"))
const RoleManage = loadable(() => import("views/UserManager/Manage/Manage"))
const Announcement = loadable(() => import("views/Announcement/Announcement"))
const AnnouncementCreate = loadable(() => import("views/Announcement/Create/Create"))
const UpdateChurch = loadable(() => import("views/ChurchActivity/UpdateChurch"))
const VerifyChurch = loadable(() => import("views/ChurchActivity/VerifyChurch"))
const Prayer = loadable(() => import("views/Prayer/Prayer"))
const Booking = loadable(() => import("views/Booking/Booking"))
const PrayerCreate = loadable(() => import("views/Prayer/Create/Create"))
const VerseCreate = loadable(() => import("views/Prayer/CreateVerse/CreateVerse"))

//#endregion


const useStyles = makeStyles((theme) => createStyles({
    rootContainer: {
        maxWidth: "100vw",
        overflow: "hidden"
    },
    root: {
        marginLeft: "auto",
        width: "100%",
        minHeight: "100vh",
        flexDirection: "column",
        backgroundColor: "#F9F5F9"
    },
    drawerOpen: {
        width: "calc(100vw - 16rem)"
    }
}))

interface IProps {
    // children: React.ReactNode
}


const DashboardLayout: React.FC<IProps> = ({ children, ...props }) => {
    const classes = useStyles()
    const { path } = useRouteMatch()
    const toast = useToast()
    const dispatch = useDispatch()
    const currentUser = useSelector((state: AppState) => (state.system.currentUser))
    const curBreakpoint = useBreakpoint()
    const isDesktop = String(curBreakpoint) !== "base" && curBreakpoint !== "sm"
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
        dispatch(getChurch(toast))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser])

    const handleToggle = () => {
        setOpen(!open)
    }
    // if (env === 'production') {
    //     console.log = function () {};
    // }

    return (
        <Box position="relative" className={classes.rootContainer} >
            <DashboardHeader handleToggle={handleToggle} />
            <Dashboard open={open} handleToggle={handleToggle} />
            <Flex className={`${classes.root} ${isDesktop && open && classes.drawerOpen}`} flex={1}>
                <Route render={({ location }) => {
                    return (
                        // <TransitionGroup>
                        //     <CSSTransition
                        //         classNames="wrapper" timeout={350} key={location.key}
                        //     >
                                <Switch location={location} >
                                    <ErrorBoundary>
                                        <Suspense fallback={<div>loading...</div>}>
                                            <Route path={`${path}/dashboard`}
                                                exact render={() => (
                                                    <Wrapper>
                                                        <DashboardView />
                                                    </Wrapper>
                                                )}
                                            />
                                            <Route path={`${path}/activity/create`}
                                                exact render={() => (
                                                    <Wrapper>
                                                        <ActivityCreate />
                                                    </Wrapper>
                                                )}
                                            />
                                            <Route path={`${path}/event/create`}
                                                exact render={() => (
                                                    <Wrapper>
                                                        <EventCreate />
                                                    </Wrapper>
                                                )}
                                            />
                                            <Route path={`${path}/activity`}
                                                exact render={() => (
                                                    <Wrapper>
                                                        <Activity />
                                                    </Wrapper>
                                                )}
                                            />
                                            <Route path={`${path}/groups`}
                                                exact render={() => (
                                                    <Wrapper>
                                                        <Group ml={{ sm: open ? "1.3rem" : "" }} />
                                                    </Wrapper>
                                                )}
                                            />
                                            <Route path={`${path}/groups/create`}
                                                exact render={() => (
                                                    <Wrapper>
                                                        <GroupCreate />
                                                    </Wrapper>
                                                )}
                                            />
                                            <Route path={`${path}/media`}
                                                exact render={() => (
                                                    <Wrapper>
                                                        <Media />
                                                    </Wrapper>
                                                )}
                                            />
                                            <Route path={`${path}/media/create`}
                                                exact render={() => (
                                                    <Wrapper>
                                                        <MediaCreate />
                                                    </Wrapper>
                                                )}
                                            />
                                            <Route path={`${path}/ads`}
                                                exact render={() => (
                                                    <Wrapper>
                                                        <Ads />
                                                    </Wrapper>
                                                )}
                                            />
                                            <Route path={`${path}/ads/create`}
                                                exact render={() => (
                                                    <Wrapper>
                                                        <AdsCreate />
                                                    </Wrapper>
                                                )}
                                            />
                                            <Route path={`${path}/subscription`}
                                                exact render={() => (
                                                    <Wrapper>
                                                        <Subscription />
                                                    </Wrapper>
                                                )}
                                            />
                                            <Route path={`${path}/finance`}
                                                exact render={() => (
                                                    <Wrapper>
                                                        <Finance />
                                                    </Wrapper>
                                                )}
                                            />
                                            <Route path={`${path}/prayer`}
                                                exact render={() => (
                                                    <Wrapper>
                                                        <Prayer />
                                                    </Wrapper>
                                                )}
                                            />
                                            <Route path={`${path}/prayer/create`}
                                                exact render={() => (
                                                    <Wrapper>
                                                        <PrayerCreate />
                                                    </Wrapper>
                                                )}
                                            />
                                            <Route path={`${path}/prayer/verse/create`}
                                                exact render={() => (
                                                    <Wrapper>
                                                        <VerseCreate/>
                                                    </Wrapper>
                                                )}
                                            />
                                            <Route path={`${path}/booking`}
                                                exact render={() => (
                                                    <Wrapper>
                                                        <Booking />
                                                    </Wrapper>
                                                )}
                                            />
                                            <Route path={`${path}/report`}
                                                exact render={() => (
                                                    <Wrapper>
                                                        <Report />
                                                    </Wrapper>
                                                )}
                                            />
                                            <Route path={`${path}/manager`}
                                                exact render={() => (
                                                    <Wrapper>
                                                        <UserManager />
                                                    </Wrapper>
                                                )}
                                            />
                                            <Route path={`${path}/manager/role`}
                                                exact render={() => (
                                                    <Wrapper>
                                                        <RoleManage />
                                                    </Wrapper>
                                                )}
                                            />
                                            <Route path={`${path}/manager/role/create`}
                                                exact render={() => (
                                                    <Wrapper>
                                                        <RoleCreate />
                                                    </Wrapper>
                                                )}
                                            />
                                            <Route path={`${path}/manager/role/edit/:roleId`}
                                                exact render={() => (
                                                    <Wrapper>
                                                        <RoleEdit />
                                                    </Wrapper>
                                                )}
                                            />
                                            <Route path={`${path}/announcement`}
                                                exact render={() => (
                                                    <Wrapper>
                                                        <Announcement />
                                                    </Wrapper>
                                                )}
                                            />
                                            <Route path={`${path}/announcement/create`}
                                                exact render={() => (
                                                    <Wrapper>
                                                        <AnnouncementCreate />
                                                    </Wrapper>
                                                )}
                                            />
                                            <Route path={`${path}/update`}
                                                exact render={() => (
                                                    <Wrapper>
                                                        <UpdateChurch />
                                                    </Wrapper>
                                                )}
                                            />
                                            <Route path={`${path}/verify`}
                                                exact render={() => (
                                                    <Wrapper>
                                                        <VerifyChurch />
                                                    </Wrapper>
                                                )}
                                            />
                                        </Suspense>
                                    </ErrorBoundary>
                                </Switch>
                        //    </CSSTransition>
                        // </TransitionGroup>
                    )
                }}
                />
            </Flex>
        </Box>
    )
}

export default DashboardLayout