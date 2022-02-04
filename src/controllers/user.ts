import { Request, Response } from 'express';

export default class UserController {
  public async getUser(request: Request, response: Response) {
    try {
      const { id } = request.params;

      return response.status(200).send({ id });
    } catch (error) {
      console.log(error);

      return response.status(400).send({ error });
    }
  }

  public async getUsers(request: Request, response: Response) {
    try {
      return response.status(200).send([]);
    } catch (error) {
      console.log(error);

      return response.status(400).send({ error });
    }
  }
}
