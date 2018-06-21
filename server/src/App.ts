import express, {Request, Response} from "express";
import bodyParser from "body-parser";
// Routers
import courseRouter from "./courses/Router";
import itemRouter from "./items/Router";
import ltiRouter from "./lti/Router";

require('dotenv').config();

// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT || 3001);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'pug');

// Apply CORS header
app.use((req: Request, res: Response, next: Function) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.use('/items', itemRouter);
app.use('/courses', courseRouter);
app.use('/lti', ltiRouter);

// 404
app.use((req: Request, res: Response, next: Function) => {
    res.status(404).send({message: "resource not found"})
});

export default app;