import { UserCtrl } from "../controller/user_ctrl";
import { t } from "elysia";

export function UserRouter(app  : any) {
    return app
    .post('/', UserCtrl.createUser, {
        body: t.Object({
            fullname: t.String()
        }),
        detail: {
            tags: ['user']
        }
    })
    .get('/', UserCtrl.getAllUsers, {
        detail: {
            tags: ['user']
        }
    })
}