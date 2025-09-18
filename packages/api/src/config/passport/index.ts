import * as passport from 'passport';
import setupJWTStrategy from './jwtStrategy';

export default function configurePassport(passport) {
  setupJWTStrategy(passport);
}