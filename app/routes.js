// app/routes.js
module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		if (req.isAuthenticated()) {
			res.redirect('/profile');
		} else {
			res.render('index.ejs'); // load the index.ejs file
		}
	});

	// =====================================
	// AUTH ================================
	// =====================================
	app.get('/auth', function (req, res) {
		if (req.isAuthenticated() && req.user.level >= 7) {
			res.sendStatus(200);
		} else {
			res.sendStatus(401);//unauthorized
		}
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function (req, res) {
		// save previous uri
		if (req.query.redirect) {
			req.session.redirect = req.query.redirect;
		}

		if (req.isAuthenticated()) {
			res.redirect('/profile');
		} else {
			// render the page and pass in any flash data if it exists
			res.render('login.ejs', { message: req.flash('loginMessage') });
		}
	});

	// process the login form
	// process the login form
	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
		function (req, res) {
			if (req.body.remember) {
				req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 30; // 30天;
			} else {
				req.session.cookie.expires = false;//关闭浏览器失效
			}
			res.redirect(req.session.redirect);
		});

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function (req, res) {
		if (req.user.username === 'JumHorn@gmail.com') {
			const redirectTo = req.session.redirect || '/bash';
			delete req.session.redirect;
			res.redirect(redirectTo);
		} else {
			res.render('profile.ejs', {
				user: req.user // get the user out of session and pass to template
			});
		}
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
