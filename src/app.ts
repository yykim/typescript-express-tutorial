import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import Controller from './interfaces/controller.interface';

class App {
  public app: express.Application;
  public port: number;

  constructor(controllers: Controller[]) {
    this.app = express();
    this.port = parseInt(process.env.PORT);

    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  private async connectToTheDatabase() {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;
    const mongodbUrl = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_PATH}`;
    try {
      console.log(`try to ${mongodbUrl}`);
      await mongoose.connect(mongodbUrl);
    } catch (ex) {
      console.error(`mongodb(${mongodbUrl}) connection fail...`);
      throw ex;
    }
    console.log(`${mongodbUrl} connected...`);
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}

export default App;
