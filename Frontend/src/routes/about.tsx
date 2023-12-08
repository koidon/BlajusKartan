import {FileRoute} from '@tanstack/react-router'

export const Route = new FileRoute('/about').createRoute({
    component: AboutComponent,
})

function AboutComponent() {
    return (
        <div className={`p-2`}>
            <div className={`text-lg`}>About Us</div>
            <h3>About us</h3>
        </div>
    )
}
