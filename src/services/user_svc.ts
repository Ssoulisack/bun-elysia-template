import Users from "../interface/users";
import db from "../adapters/database";

export const UserSvc = {
    createUser: async (req : Users) => {
        try {
            const user = await db.users.create({
                data: {
                    fullname: req.fullname
                },
                select: {
                    id: true
                }
            })
            return user.id
        } catch (error) {
            throw new Error('error')
        }
    },

    getAllUsers: async () => {
        try {
            const users = await db.users.findMany({
                where: {
                    deleted_at: null
                },
                select: {
                    id: true,
                    fullname: true
                }
            })
            return users
        } catch (error) {
            throw new Error('error')
        }
    }
}