import {
    Outlet, RootRoute,
} from '@tanstack/react-router'
import {TanStackRouterDevtools} from '@tanstack/router-devtools'
import Navigation from "@/components/Navigation.tsx";

export const Route = new RootRoute({
    component: RootComponent,
})

function RootComponent() {
    return (
        <>
        <div className="h-full flex dark:bg-[#1F1F1F]">
            <Navigation />
            <main className="flex-1 h-full overflow-y-auto">
                <Outlet />
            </main>
        </div>
            <TanStackRouterDevtools position="bottom-right"/>
        </>
    )
}
