const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()

class UserController {
    async list(req, res, next) {

        const { name, email, limit = "10", offset = "0" } = req.query;

        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true },
            skip: parseInt(offset),
            first: parseInt(limit),
            where: {
                OR: {
                    name: {
                        contains: name
                    },
                    email: {
                        contains: email
                    }
                }
            }
        }).catch(err => next(err))

        if (users) {
            res.set('X-Total-Count', users.length);
            res.json(users);
        }
    }

    async authenticate(req, res, next) {
        const user = await prisma.user.findOne({
            where: {
                email: req.body.email
            }
        }).catch(err = next(err));

        if (user) {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.json({ user: user, token: token });
            } else {
                res.status(404).json({ status: "error", message: "Email/Senha inválido!" });
            }
        }
    }
}

module.exports = new UserController();