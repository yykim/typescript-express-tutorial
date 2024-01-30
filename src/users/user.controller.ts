import * as express from 'express';
import Controller from '../interfaces/controller.interface';
import authMiddleware from '../middlewares/auth.middleware';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import NotAuthorizedException from '../exceptions/NotAuthorizedException';
import postModel from '../posts/posts.model';

class UserController implements Controller {
  public path = '/users';
  public router = express.Router();
  private post = postModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:id/posts`, authMiddleware, this.getAllPostsOfUser);
  }

  private getAllPostsOfUser = async (
    request: RequestWithUser,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const userId = request.params.id;
    if (userId !== request.user._id.toString()) {
      next(new NotAuthorizedException());
    } else {
      const posts = await this.post.find({
        author: userId,
      });
      response.send(posts);
    }
  };
}

export default UserController;
