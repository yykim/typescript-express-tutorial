import * as express from 'express';
import Post from './post.interface';
import Controller from '../interfaces/controller.interface';
import postModel from './posts.model';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import validationMiddleware from '../middlewares/validation.middleware';
import CreatePostDto from './post.dto';
import authMiddleware from '../middlewares/auth.middleware';
import RequestWithUser from 'interfaces/requestWithUser.interface';

class PostsController implements Controller {
  public path = '/posts';
  public router = express.Router();
  public post = postModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);

    this.router
      .all(`${this.path}/*`, authMiddleware)
      .patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.modifyPost)
      .delete(`${this.path}/:id`, this.deletePost)
      .post(this.path, authMiddleware, validationMiddleware(CreatePostDto), this.createAPost);
  }

  private getAllPosts = async (request: express.Request, response: express.Response) => {
    const posts = await this.post.find().populate('author', '-password');
    response.send(posts);
  };

  private getPostById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const id = request.params.id;
    const post = await this.post.findById(id).populate('author', '-password');
    if (post) {
      response.send(post);
    } else {
      next(new PostNotFoundException(id));
    }
  };

  private modifyPost = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const id = request.params.id;
    const postData: Post = request.body;
    const post = await this.post.findByIdAndUpdate(id, postData, { new: true }).populate('author', '-password');
    if (post) {
      response.send(post);
    } else {
      next(new PostNotFoundException(id));
    }
  };

  private deletePost = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const id = request.params.id;
    this.post.findByIdAndDelete(id).then((successResponse) => {
      if (successResponse) {
        response.send(200);
      } else {
        next(new PostNotFoundException(id));
      }
    });
  };

  private createAPost = async (request: RequestWithUser, response: express.Response) => {
    const postData: Post = request.body;
    const createdPost = new this.post({
      ...postData,
      author: request.user._id,
    });

    const savedPost = await createdPost.save();
    await savedPost.populate('author', '-password');
    response.send(savedPost);
  };
}

export default PostsController;
