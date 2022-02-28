////////////////////////////////////////////////
////////////// index.js file ///////////////////
////////////////////////////////////////////////

const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const bcrypt = require('bcrypt');

// Database user operations
const { createUser, fetchUser } = require('./db.js');

// Private RS256 key
const rs256Key = fs.readFileSync('./jwtRS256.key');
// Salt rounds for hashing
const saltRounds = 10;

// Setup app
const app = express();
app.use(express.json());


// Register endpoint
app.post('/register', (req, res) => {
	const { name, email, password } = req.body;

	bcrypt.hash(password, saltRounds, (err, passHash) => {
		if (err) {
			console.log(err);
			return res.json({
				error: 'Sorry, our server seems to be doing weird stuff right now.',
				errorCode: 'INTERNAL_ERROR'
			});
		}

		const userExists = fetchUser( email );
		if (userExists) {
			return res.json({
				error: 'User already exists with that email ID.',
				errorCode: 'EMAIL_UNAVAILABLE'
			});
		}

		createUser(email, passHash, name);

		console.log(users);

		res.json({ status: 'success', message: 'User created successfully.' });

	});
});

// Login endpoint
app.post('/login', (req, res) => {
	const { email, password } = req.body;

	const userData = fetchUser(email);

	if ( ! userData ) {
		return res.json({
			error: 'User doesn\'t exist with that email ID.',
			errorCode: 'USER_DOES_NOT_EXIST'
		});
	}

	bcrypt.compare(password, userData.passHash, (err, match) => {

		if (err) {
			console.log(err);
			return res.json({
				error: 'Sorry, our server seems to be doing weird stuff right now.',
				errorCode: 'INTERNAL_ERROR'
			});
		}

		if (!match) {
			return res.json({
				error: 'Sorry, password seems to be incorrect.',
				errorCode: 'PASSWORD_MISMATCH'
			});
		}



		// Create the JWT
		jwt.sign(
			userData,
			rs256Key,
			{ algorithm: 'RS256', expiresIn: '60d' },
			(err, jwToken) => {
				if (err) {
					console.log(err);
					return res.json({
						error: 'Sorry, our server seems to be doing weird stuff right now.',
						errorCode: 'INTERNAL_ERROR'
					});
				}
				res.json({
					status: 'success',
					message: 'User signed in successfully.',
					jwt: jwToken
				});
			}
		);
	});
});

// Start listening
const port = 5002;
const server = app.listen(port, () => {
	console.log('Server listening at http://localhost:' + port);
});

////////////////////////////////////////////////
//////////////// db.js file ////////////////////
////////////////////////////////////////////////

// Make believe database
// Structure like this,
// email: { email, passHash, name... }
users = {};

/**
 * Create user
 * @param {string} email 
 * @param {string} passHash 
 * @param {string} name 
 */
function createUser(email, passHash, name) {
	users[email] = {email, passHash, name}
}

/**
 * Fetch user
 * @param {string} email 
 * @returns 
 */
function fetchUser(email) {
	return users[email];
}

module.exports = {createUser, fetchUser};