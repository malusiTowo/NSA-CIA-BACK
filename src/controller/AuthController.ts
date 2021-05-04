import {validate} from 'class-validator';
import {Request, Response} from 'express';
import * as jwt from 'jsonwebtoken';
import {getRepository} from 'typeorm';
import config from '../config/config';
import {User} from '../entity/User';

class AuthController {

  public static register = async (req: Request, res: Response) => {
    const {username, password} = req.body;
    const user = new User();
    user.username = username;
    user.password = password;
    user.role = "NORMAL";

    // Validade if the parameters are ok
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    // Hash the password, to securely store on DB
    user.hashPassword();

    // Try to save. If fails, the username is already in use
    const userRepository = getRepository(User);
    try {
      await userRepository.save(user);
    } catch (e) {
      res.status(409).send('username already in use');
      return;
    }

    // If all ok, send 201 response
    res.status(201).send('User created');
  };

  public static login = async (req: Request, res: Response) => {
    const {username, password} = req.body;
    if (!(username && password)) {
      res.status(400).send('Body was empty');
    }
    // Get user from database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({
        where: {username},
      });
    } catch (error) {
      res.status(401).send('username or password incorrect');
      return;
    }
    // Check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      res.status(401).send('username or password incorrect');
      return;
    }

    // Sing JWT, valid for 1 hour
    const token = jwt.sign(
      {userId: user.id, username: user.username},
      config.jwtSecret,
      {expiresIn: '1h'},
    );
    res.send({token});
  };

  public static getMe = async (req: Request, res: Response) => {
    // Get user from database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({
        select: ['id', 'username', 'role'],
        where: {id: res.locals.jwtPayload.userId},
      });
      res.send({user});
    } catch (error) {
      res.status(404).send('User not found');
      return;
    }
  };

  public static changePassword = async (req: Request, res: Response) => {
    // Get ID from JWT
    const id = res.locals.jwtPayload.userId;

    // Get parameters from the body
    const {oldPassword, newPassword} = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).send();
    }

    // Get user from the database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send();
      return;
    }

    // Check if old password matchs
    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      res.status(401).send();
      return;
    }

    // Validate de model (password lenght)
    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    // Hash the new password and save
    user.hashPassword();
    await userRepository.save(user);

    res.status(204).send();
  };
}
export default AuthController;
