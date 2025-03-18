import { UserRouter } from "./user_rou";


export function MainRoutes(app: any) {
    return app
    .group('/user', UserRouter)
}