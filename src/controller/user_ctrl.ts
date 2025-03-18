import { UserSvc } from "../services/user_svc"
import { response } from "./response"

export const UserCtrl = {
    createUser: async (ctx : any) => {
        const userID = await UserSvc.createUser({
            fullname: ctx.body.fullname
        })
        ctx.set.status = 200
        return {
            status: 'success',
            message: `create user ${ctx.body.fullname} successfully`,
            data: {
                id: userID
            }
        }
    },

    getAllUsers: async (ctx : any) => {
        const users = await UserSvc.getAllUsers()
        ctx.set.status = 200
        return response.SuccessResponse(ctx, users)
    }
}