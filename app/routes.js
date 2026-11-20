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
		if (req.isAuthenticated()) {
			res.redirect('/profile');
		} else {
			// render the page and pass in any flash data if it exists
			res.render('login.ejs', { message: '', redirect: req.query.redirect || '' });
		}
	});

	// process the login form
	app.post('/login', function (req, res, next) {
		passport.authenticate('local-login', function (err, user, info) {
			if (err) { return next(err); }
			if (!user) {
				// 登录失败：错误信息直接随本次响应渲染（不经过 flash），
				// 失败的登录不会向 sessions 表写入任何数据
				return res.render('login.ejs', {
					message: (info && info.message) || '',
					redirect: req.body.redirect || ''
				});
			}
			req.logIn(user, function (err) {
				if (err) { return next(err); }
				if (req.body.remember) {
					req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 30; // 30天;
				} else {
					req.session.cookie.expires = false;//关闭浏览器失效
				}
				// redirect 目标页只在登录成功后才写入 session（此时已是登录用户）
				var redirectTo = req.body.redirect;
				if (typeof redirectTo === 'string' && redirectTo.charAt(0) === '/' && redirectTo.charAt(1) !== '/') {
					req.session.redirect = redirectTo;
				}
				res.redirect('/profile');
			});
		})(req, res, next);
	});

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: '' });
	});

	// process the signup form
	app.post('/signup', function (req, res, next) {
		passport.authenticate('local-signup', function (err, user, info) {
			if (err) { return next(err); }
			if (!user) {
				// 注册失败：错误信息直接随本次响应渲染，不写入 session
				return res.render('signup.ejs', { message: (info && info.message) || '' });
			}
			req.logIn(user, function (err) {
				if (err) { return next(err); }
				res.redirect('/profile');
			});
		})(req, res, next);
	});

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
