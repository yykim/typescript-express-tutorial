import * as express from 'express';
import Post from './post.interface';
import Controller from '../interfaces/controller.interface';
import postModel from './posts.model';

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
    this.router.patch(`${this.path}/:id`, this.modifyPost);
    this.router.delete(`${this.path}/:id`, this.deletePost);
    this.router.post(this.path, this.createAPost);
  }

  private getAllPosts = (request: express.Request, response: express.Response) => {
    this.post.find().then((posts) => {
      response.send(posts);
    });
  };

  private getPostById = (request: express.Request, response: express.Response) => {
    const id = request.params.id;
    this.post.findById(id).then((post) => {
      response.send(post);
    });
  };

  private modifyPost = (request: express.Request, response: express.Response) => {
    const id = request.params.id;
    const postData: Post = request.body;
    this.post.findByIdAndUpdate(id, postData, { new: true }).then((post) => {
      response.send(post);
    });
  };

  private deletePost = (request: express.Request, response: express.Response) => {
    const id = request.params.id;
    this.post.findByIdAndDelete(id).then((successResponse) => {
      if (successResponse) {
        response.send(200);
      } else {
        response.send(404);
      }
    });
  };

  createAPost = (request: express.Request, response: express.Response) => {
    const postData: Post = request.body;
    const createdPost = new this.post(postData);
    createdPost.save().then((savedPost) => {
      response.send(savedPost);
    });
  };
}

export default PostsController;
