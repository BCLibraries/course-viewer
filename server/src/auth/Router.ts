import {Request, Response} from "express";
import authenticate from "./LDAP";
import User from "./User";

let router = require('express').Router();

router.post("/ldap", (req: Request, res: Response) => {
    authenticate(req.body.username, req.body.password)
        .then((user: User) => {
            res.send();
        })
        .catch((reason: any) => {
            res.send();
        });
});



export default router;