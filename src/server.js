const { tokens } = require('../bot/struct/bot');
const { resolve } = require('path');
const { Client, EvaluatedPermissions } = require('discord.js');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const Strategy = require('passport-discord').Strategy;
const url = require('url');
const helmet = require('helmet');
const moment = require('moment');
const client = new Client();
client.login(tokens.discord);


const app = express();
app.set('view engine', 'ejs');
app.use(express.static(resolve(__dirname, 'public')));
app.set('views', __dirname);

app.get('/support', (req, res) => {
	res.redirect('https://discord.gg/yWyz5YE');
});
passport.serializeUser((user, done) => {
	done(null, user);
});
passport.deserializeUser((obj, done) => {
	done(null, obj);
});

passport.use(new Strategy({
	clientID: '484766518438133760',
	clientSecret: 'DLBIZ5bih1y_4gx5ZXJyeouSTQEGFERa',
	callbackURL: 'https://beta.abayro.xyz/auth',
	scope: ['identify', 'guilds', 'guilds.join']
},
(accessToken, refreshToken, profile, done) => {
	process.nextTick(() => done(null, profile));
}));
app.use(session({
	store: new MemoryStore({
		checkPeriod: 86400000
	}),
	secret: 'clientsessiosabayrosecret123123123',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet());
app.locals.domain = 'beta.abayro.xyz';
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

function checkAuth(req, res, next) {
	if (req.isAuthenticated()) return next();
	req.session.backURL = req.url;
	res.redirect('/login');
}
app.get('/login', (req, res, next) => {
	if (req.session.backURL) {
		req.session.backURL = 'https://beta.abayro.xyz/auth';
	} else if (req.headers.referer) {
		const parsed = url.parse(req.headers.referer);
		if (parsed.hostname === app.locals.domain) {
			req.session.backURL = parsed.path;
		}
	} else {
		req.session.backURL = '/dashboard';
	}
	next();
},
passport.authenticate('discord'));
app.get('/auth', passport.authenticate('discord', {
	failureRedirect: '/autherror'
}), (req, res) => {
	if (req.session.backURL) {
		const refurl = req.session.backURL;
		req.session.backURL = null;
		res.redirect(refurl);
	} else {
		res.redirect('/dashboard');
	}
});

app.get('/autherror', (req, res) => {
	res.render(res, req, 'views/pages/autherror.ejs');
});


app.get('/dashboard', checkAuth, (req, res) => {
	const user = req.isAuthenticated() ? req.user : null;
	const botStats = [{
		botty: client,
		perms: EvaluatedPermissions,
		user: req.isAuthenticated() ? req.user : null
	}];
	res.render('views/pages/dashboard', {
		bot: botStats, user, settings
	});
});

app.get('/guilds/:guildID', checkAuth, (req, res) => {
	res.redirect(`/guilds/${req.params.guildID}/manage`);
});

app.get('/user/:userID', checkAuth, (req, res) => {
	const user = req.isAuthenticated() ? req.user : null;
	res.redirect(`/user/${user.id}/stats`);
});

app.get('/copyrighted-b601120a3e37bacb.html', (req, res) => {
	res.render('views/pages/copyrighted-b601120a3e37bacb.ejs');
});
app.get('/user/:userID/stats', checkAuth, (req, res) => {
	const userStats = [{
		botty: client,
		user: req.isAuthenticated() ? req.user : null
	}];
	res.render('user/stats', {
		bot: userStats
	});
});

app.get('/user/:userID/pcard', checkAuth, (req, res) => {
	const userStats = [{
		botty: client,
		user: req.isAuthenticated() ? req.user : null
	}];
	res.render('user/pcard', {
		bot: userStats
	});
});


app.get('/abayro-js/css/main.css', (req, res) => {
	res.redirect('/abayro/api/v3/stylesheets/css/scss/css/ABAYRO-STYLESHEET-NOURELDIEN[1].theme.css');
});

app.get('/store/profile', checkAuth, (req, res) => {
	const userStats = [{
		botty: client,
		user: req.isAuthenticated() ? req.user : null
	}];
	res.render('shop', {
		bot: userStats
	});
});

app.get('/guilds/:guildID/manage', checkAuth, (req, res) => {
	const guild = client.guilds.get(req.params.guildID);
	if (!guild) return res.status(404);
	const isManaged = guild && Boolean(guild.member(req.user.id)) ? guild.member(req.user.id).permissions.has('MANAGE_GUILD') : false;
	if (!isManaged && !req.session.isAdmin) res.redirect('/');
	const groles = app.get(`https://discordapp.com/api/v6/guilds/${req.params.guildID}/roles`);
	const user = req.isAuthenticated() ? req.user : null;
	const botStats = [{
		bot: client,
		perms: EvaluatedPermissions,
		moment,
		guildroles: groles
	}];
	res.render('views/guild/manage.ejs', {
		guild,
		user,
		settings,
		bot: botStats
	});
});


app.get('/leaderboard/servers', (req, res) => {
	const bot = client;
	const user = req.isAuthenticated() ? req.user : null;
	res.render('views/pages/gleaders', {
		bot, user
	});
});

app.get('/leaderboard/servers/2', (req, res) => {
	const bot = client;
	const user = req.isAuthenticated() ? req.user : null;
	res.render('views/pages/gleaders2', {
		bot, user
	});
});

app.get('/leaderboard/servers/3', (req, res) => {
	const bot = client;
	const user = req.isAuthenticated() ? req.user : null;
	res.render('views/pages/gleaders3', {
		bot, user
	});
});

app.post('/guilds/:guildID/manage', checkAuth, (req, res) => {
	const guild = client.guilds.get(req.params.guildID);
	if (!guild) return res.status(404);
	const isManaged = guild && Boolean(guild.member(req.user.id)) ? guild.member(req.user.id).permissions.has('MANAGE_GUILD') : false;
	if (!isManaged && !req.session.isAdmin) res.redirect('/');
	// client.writeSettings(guild.id, req.body);
	res.redirect(`/guilds/${req.params.guildID}/manage`);
});

app.get('/api/', (req, res) => {
	res.render('views/pages/autherror');
});

app.get('/logout', (req, res) => {
	req.session.destroy(() => {
		req.logout();
		res.redirect('/');
	});
});

app.get('/', (req, res) => {
	const guildCount = client.guilds.size;
	const botStatus = client.user.presence.status;
	const usersCount = client.users.size;
	const bot = client;
	const user = req.isAuthenticated() ? req.user : null;
	const useradmin = req.session.isAdmin;
	res.render('views/pages/index', {
		guildCount, botStatus, usersCount, bot, user, useradmin
	});
});

app.get('/api/v4/abayro-js', (req, res) => {
	res.render('views/pages/autherror');
});

app.get('/about', (req, res) => {
	const user = req.isAuthenticated() ? req.user : null;
	const abdevs = client.guilds.get('470205496259772437').roles.get('470214128758423573').members
	const abteam = client.guilds.get('470205496259772437').roles.get('471388844441468948').members.filter(member => !member.roles.has('470214128758423573'))
	const contribs = client.guilds.get('470205496259772437').roles.get('541696997648891924').members.filter(member => !member.roles.has('470214128758423573'))
	res.render('views/pages/about', {
		user, abdevs, abteam, contribs
	});
});

app.get('/premium', (req, res) => {
	const botStats = [{
		bot: client,
		user: req.isAuthenticated() ? req.user : null
	}];
	res.render('views/pages/premium', { bot: botStats });
});

app.get('/premium/subscribe', (req, res) => {
	const botStats = [{
		bot: client,
		user: req.isAuthenticated() ? req.user : null
	}];
	res.render('views/pages/subscribe', { bot: botStats });
});

app.get('/store', checkAuth, (req, res) => {
	res.render('views/pages/store');
});
app.get('/features', (req, res) => {
	const user = req.isAuthenticated() ? req.user : null;
	res.render('views/pages/features', {
		client, user
	});
});

app.get('/invite', (req, res) => {
	res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=484766518438133760&permissions=8&scope=bot`);
});
app.listen(3000);

app.get('*', (req, res) => {
	if (res.status(404)) {
		const bot = client;
		const user = req.isAuthenticated() ? req.user : null;
		res.render('views/errors/notfound.ejs', {
			bot, user
		});
	}
});
