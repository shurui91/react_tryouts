const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');
// https://powerful-sea-34392.herokuapp.com/
// after require keys.js file, we can use the credential at here
const User = mongoose.model('users');

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id).then(user => {
		done(null, user);
	});
});

passport.use(
	new GoogleStrategy(
		{
			clientID: keys.googleClientId,
			clientSecret: keys.googleClientSecret,
			callbackURL: '/auth/google/callback',
			proxy: true
		},
		async (accessToken, refreshToken, profile, done) => {
			// console.log('access token', accessToken);
			// console.log('refresh token', refreshToken);
			// console.log('profile', profile);
			const existingUser = await User.findOne({ googleId: profile.id });
			if (existingUser) {
				// we already have a record with the given profile ID
				done(null, existingUser);
			} else {
				// we don't have a user record with this ID, make a new record
				// this determines we need to require user.js before passport.js
				const user = await new User({ googleId: profile.id }).save();
				done(null, user);
			}
		}
	)
);
