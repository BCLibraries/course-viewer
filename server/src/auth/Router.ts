import {Request, Response} from "express";
import authenticate from "./LDAP";
import User from "./User";

let router = require('express').Router();

router.post('', (req: Request, res: Response) => {
    authenticate(req.body.username, req.body.password)
        .then((user: User) => {
            res.send({
                'success': true,
                'user': user
            });
        })
        .catch((reason: any) => {
            res.send({'success': false});
        });
});


export default router;