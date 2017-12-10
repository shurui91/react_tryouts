const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./config/keys');

const app = express();

passport.use(
	new GoogleStrategy(
		{
			clientID: keys.googleClientID,
			clientSecret: keys.googleClientSecret,
			callbackURL: '/auth/google/callback'
		},
		accessToken => {
			console.log(accessToken);
		}
	)
);

/* the first parameter 'google' is an internal way to tell
passport to use GoogleStrategy to verify the user */
// scope tells google to give the profile and email info
app.get(
	'/auth/google',
	passport.authenticate('google', {
		scope: ['profile', 'email']
	})
);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
