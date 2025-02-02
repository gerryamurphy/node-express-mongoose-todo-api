const User = require('../users/user-model');
const bcrypt = require('bcrypt');
const config = require('../../config/config');
const jwt = require('jsonwebtoken');
const AppError = require('../helpers/AppError');

exports.login = async (req, res, next) => {
	console.log(req.body);
	const email = req.body.email;
	const password = req.body.password;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			console.log("User does not exist");
			return next(new AppError('User does not exist', 401));
		}
		const isMatch = await bcrypt.compare(password, user.password);
		if (isMatch) {

			const token = user.generateToken();
			//console.log(user.id);
			//console.log(token);
			return res.json({
				id: user.id,
				firstName: 'gerry', //user.firstName,
        lastName: 'murphy' , //user.lastName,
				token: token,
			});
		}
		return next(new AppError('Wrong password', 401));
	} catch (err) {
		return next(err);
	}
};

exports.register = async (req, res, next) => {
	try {
		const user = await User.create(req.body);
		const token = user.generateToken();
		return res.json({
			id: user.id,
			//username: user.username,
			//firstName: user.firstName,
			//lastName: user.lastName,
			// username: user.username,
											// firstName: user.firstName,
											// lastName: user.lastName,
											// token: 'fake-jwt-token'
			token: token,
		});
	} catch (err) {
		return next(err);
	}
};

exports.checkAuth = async (req, res, next) => {
	const token = req.header('authorization');
	if (!token) {
		return next(new AppError('No token provided', 401));
	}
	try {
		const decoded = jwt.verify(token, config.jwtSecret);
		return res.json({
			id: decoded.user._id,
			token,
		});
	} catch (err) {
		return next(err);
	}
};
