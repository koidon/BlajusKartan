import {FileRoute} from '@tanstack/react-router'

export const Route = new FileRoute('/history').createRoute({
    component: HistoryComponent,
})

function HistoryComponent() {
    return (
        <div className={`p-2`}>
            <div className={`text-lg`}>History</div>
        </div>
    )
}
