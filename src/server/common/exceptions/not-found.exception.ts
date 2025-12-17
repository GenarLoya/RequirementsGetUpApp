import { HttpException } from './http-exception';

export class NotFoundException extends HttpException {
  constructor(message: string = 'Not Found') {
    super(message, 404, 'Not Found');
  }
}
