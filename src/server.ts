import 'reflect-metadata';

import express, { Response, Request } from 'express';
import { Routes } from './routes';
import cors from 'cors';
import * as path from 'path';

import './database';

const app = express();

app.use(express.json());

Routes.forEach(route => {
  (app as any)[route.method](route.route,
    (req: Request, res: Response) => {
      const result = (new (route.controller as any))[route.action](req, res);
      if (result instanceof Promise) {
        result.then(result => result !== null && result !== undefined ?
          res.status(result.status).json(result.data) :
          undefined);

      } else if (result !== null && result !== undefined) {
        res.status(result.status).json(result.data);
      }
    });
});

app.use(cors());
app.use('/game', express.static(path.resolve(__dirname, '..', 'public')));

app.listen(3333, () => console.log('server is running '));