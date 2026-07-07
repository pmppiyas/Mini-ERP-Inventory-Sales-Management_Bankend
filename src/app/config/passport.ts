import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcryptjs from 'bcryptjs';
import { User } from '../module/user/user.model';

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },

    async (identifier: string, password: string, done: any) => {
      try {
        console.log('Email=>', identifier);
        console.log('Password:=>', password);

        const isUserExist = await User.findOne({ email: identifier });

        if (!isUserExist) {
          return done(null, false, { message: 'User not found.' });
        }

        const isPasswordMatch = await bcryptjs.compare(
          password,
          isUserExist.password || ''
        );

        if (!isPasswordMatch) {
          return done(null, false, { message: 'Password is wrong.' });
        }

        return done(null, isUserExist, { message: 'Login successfull.' });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
