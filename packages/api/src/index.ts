import * as express from 'express';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as logger from 'morgan';
import * as dotenv from 'dotenv';
dotenv.config();
import { db } from "./data-source";
import { User } from './entities/userEntity';
import configurePassport from './config/passport';
import router from './routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static('uploads'));
app.use(cookieParser());
app.use(passport.initialize());
configurePassport(passport);

app.use('/', router);

db.initialize().then(async () => {
  console.log("Data source initialization successful");

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch(error => {
  console.log("Data source initialization failed:", error);
});

passport.serializeUser((user: User, done) => {
  done(null, user.user_id);
});

passport.deserializeUser(async (user_id: number, done) => {
  const userRepository = db.getRepository(User);
  try {
    const user = await userRepository.findOneBy({ user_id: user_id });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
