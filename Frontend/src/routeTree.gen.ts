import { Route as rootRoute } from "./routes/__root"
import { Route as AboutRoute } from "./routes/about"
import { Route as IndexRoute } from "./routes/index"
import { Route as HistoryRoute } from "./routes/history"



declare module "@tanstack/react-router" {
    interface FileRoutesByPath {
        "/": {
            parentRoute: typeof rootRoute

        }
        "/history": {
            parentRoute: typeof rootRoute
        }
        "/about": {
            parentRoute: typeof rootRoute
        }
    }
}

Object.assign(IndexRoute.options, {
    path: "/",
    getParentRoute: () => rootRoute,
})

Object.assign(HistoryRoute.options, {
    path: "/history",
    getParentRoute: () => rootRoute,
})

Object.assign(AboutRoute.options, {
    path: "/about",
    getParentRoute: () => rootRoute,
})

export const routeTree = rootRoute.addChildren([IndexRoute, AboutRoute, HistoryRoute])
