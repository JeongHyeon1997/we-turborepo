import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();
      const message = typeof res === 'string' ? res : (res as any).message ?? '요청 처리 중 오류가 발생했습니다';
      reply.status(status).send({ message });
      return;
    }

    if (exception instanceof Error && exception.message) {
      reply.status(HttpStatus.BAD_REQUEST).send({ message: exception.message });
      return;
    }

    reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: '서버 오류가 발생했습니다' });
  }
}
