import * as passport from 'passport';

const authMiddleware = passport.authenticate('jwt', { session: false, failureMessage: false });

export default authMiddleware;
