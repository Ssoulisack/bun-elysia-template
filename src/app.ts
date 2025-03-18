import { Elysia, t } from 'elysia';
import { jwt } from '@elysiajs/jwt'
import { bearer } from '@elysiajs/bearer'
import { cors } from '@elysiajs/cors'
import { logger } from '@grotto/logysia';

import * as log from './utilities/logger';
import { AuthenticationError } from './exception/AuthenticationError';
import { AuthorizationError } from './exception/AuthorizationError';
import { DataNotFoundError } from './exception/DataNotFound';
import { response } from './controller/response';
import { MainRoutes } from './routes/main';
import { mailer } from './adapters/mailer';
import { middleware } from './middleware/auth';

let version = await Bun.file('version').text()
export const app = new Elysia()
  .use(bearer())
  .use(cors())
  .use(jwt({
    name: 'jwt',
    secret: Bun.env.JWT_SECRET!,
    exp: '7d'
  }))
  .use(jwt({
    name: 'refreshJwt',
    secret: Bun.env.JWT_REFRESH!
  }))
  .error('AUTHENTICATION_ERROR', AuthenticationError)
  .error('AUTHORIZATION_ERROR', AuthorizationError)
  .error('DATANOTFOUND_ERROR', DataNotFoundError)
  .onError(({ code, error, set }) => {
    log.logger.Error(error)
    switch (code) {
      case 'VALIDATION':
        set.status = 422
        return {
          status: 'error',
          message: error.validator
        }
      case 'PARSE':
        set.status = 400
        return {
          status: 'error',
          message: error.message.toString().replace('Error: ', '')
        }
      case 'AUTHENTICATION_ERROR':
        set.status = 401
        return {
          status: 'error',
          message: error.message.toString().replace('Error: ', '')
        }
      case 'AUTHORIZATION_ERROR':
        set.status = 403
        return {
          status: 'error',
          message: error.message.toString().replace('Error: ', '')
        }
      case 'NOT_FOUND':
        set.status = 404
        return {
          status: 'error',
          message: 'Route not found'
        }
      case 'DATANOTFOUND_ERROR':
        set.status = 404
        return {
          status: 'error',
          message: error.message.toString().replace('Error: ', '')
        }
      case 'INTERNAL_SERVER_ERROR':
        set.status = 500
        return {
          status: 'error',
          message: 'Something went wrong!'
        }
      case 'UNKNOWN':
        set.status = 500
        return {
          status: 'error',
          message: 'Something went wrong!'
        }
      default:
        const errorMessage = response.ErrorResponse(set, error);
        set.status = errorMessage.status
        log.logger.Error(error)
        return {
          status: 'error',
          message: errorMessage.message
        }
    }
  })
  .use(logger({
    logIP: false,
    writer: {
      write(msg: string) {
        console.log(msg + ' | ' + new Date())
      }
    }
  }))
  .get('/api/health', () => 'OK', {
    detail: {
      tags: ['health']
    }
  })
  .post('/api/mail', mailer.SendEmailCtrl, {
    beforeHandle: middleware.IsAuth,
    body: t.Object({
      subject: t.String(),
      body: t.String(),
      recipients: t.Array(t.String(
        {
          format: 'email',
          error: 'Invalid email'
        }
      )),
      cc: t.Array(t.String(
        {
          format: 'email',
          error: 'Invalid email'
        }
      ))
    }),
    detail: {
      tags: ['mailer']
    }
  })
  .group('/api', MainRoutes)

