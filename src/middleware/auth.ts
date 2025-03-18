export const middleware = {
    GenerateToken: async (ctx: any, id: number) => {
        const access_token = await ctx.jwt.sign({ id: id });
        const refresh_token = await ctx.refreshJwt.sign({ id: id });
        return {
            data: {
                access_token: access_token,
                refresh_token: refresh_token,
            },
        };
    },

    GenerateFormToken: async (ctx: any, form_id: number, recipient_id: number) => {
        const access_token = await ctx.jwt.sign({ form_id: form_id, recipient_id: recipient_id }, { expiresIn: '72h' });
        return access_token;
    },

    IsAuth: async (ctx: any) => {
        if (!ctx.bearer) {
            ctx.set.status = 401
            ctx.set.headers[
                'WWW-Authenticate'
            ] = `Bearer realm='sign', error='invalid_request'`

            return {
                status: 'error',
                message: 'Unauthorized'
            }
        }

        const profile = await ctx.jwt.verify(ctx.bearer);
        if (!profile) {
            ctx.set.status = 401
            ctx.set.headers[
                'WWW-Authenticate'
            ] = `Bearer realm='sign', error='invalid_request'`

            return {
                status: 'error',
                message: 'Unauthorized'
            }
        }
    },

    IsFormAuth: async (ctx: any) => {
        if (!ctx.bearer) {
            ctx.set.status = 401
            ctx.set.headers[
                'WWW-Authenticate'
            ] = `Bearer realm='sign', error='invalid_request'`

            return {
                status: 'error',
                message: 'Unauthorized'
            }
        }

        const profile = await ctx.jwt.verify(ctx.bearer);
        if (!profile) {
            ctx.set.status = 401
            ctx.set.headers[
                'WWW-Authenticate'
            ] = `Bearer realm='sign', error='invalid_request'`

            return {
                status: 'error',
                message: 'Unauthorized'
            }
        }

        if (!profile.form_id) {
            return {
                status: 'error',
                message: 'Unauthorized'
            }
        }
    },

    GetFormIdFromToken: async (ctx: any): Promise<{ form_id: number, recipient_id: number }> => {
        if (!ctx.bearer) {
            ctx.set.status = 401
            throw new Error('Unauthorized')
        }
        const profile = await ctx.jwt.verify(ctx.bearer);
        if (!profile) {
            ctx.set.status = 401
            throw new Error('Unauthorized')
        }
        return profile
    },

    GetUserFromToken: async (ctx: any): Promise<number> => {
        if (!ctx.bearer) {
            ctx.set.status = 401
            throw new Error('Unauthorized')
        }
        const profile = await ctx.jwt.verify(ctx.bearer);
        if (!profile) {
            ctx.set.status = 401
            throw new Error('Unauthorized')
        }
        return profile.id
    }
}