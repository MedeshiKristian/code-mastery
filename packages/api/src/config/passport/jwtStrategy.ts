import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { db } from '../../data-source';
import { User } from '../../entities/userEntity';

const options = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => {
      return req?.cookies?.jwt || null;
    }
  ]),
  secretOrKey: process.env.JWT_SECRET || 'your_secret_key',
};

export default function setupJWTStrategy(passport) {
  passport.use(new JwtStrategy(options, async (jwt_payload, done) => {
    const userRepository = db.getRepository(User);
    try {
      const user = await userRepository.findOneBy({ user_id: jwt_payload.user_id });
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  }));
}