import express, {Request, Response} from "express";
import bodyParser from "body-parser";
// Routers
import courseRouter from "./courses/Router";
import itemRouter from "./items/Router";
import ltiRouter from "./lti/Router";
import authRouter from "./auth/Router";

require('dotenv').config();

// Create Express server
const app = express();

if (process.env.BEHIND_PROXY) {
    app.set('trust proxy', true);
}

// Express configuration
app.set("port", process.env.PORT || 3001);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'pug');

// Apply CORS header
app.use((req: Request, res: Response, next: Function) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')

    // Handle CORS preflight requests
    if ('OPTIONS' === req.method) {
        res.send(200);
    } else {
        next();
    }
});

app.use('/items', itemRouter);
app.use('/courses', courseRouter);
app.use('/lti', ltiRouter);
app.use('/auth', authRouter);

// 404
app.use((req: Request, res: Response, next: Function) => {
    res.status(404).send({message: "resource not found"})
});

export default app;