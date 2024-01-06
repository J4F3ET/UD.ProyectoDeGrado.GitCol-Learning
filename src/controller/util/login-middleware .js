import {auth} from "../../model/firebase-service.js";
export const releaseVerificationMiddleware = (req, res, next) => {
	if (undefined !== req.headers.cookie) {
		verifyAccessCookieMiddleware(req, res, next);
	} else if (undefined !== req.headers["authorization"]) {
		verifyIdTokenMiddleware(req, res, next);
	} else {
		res.status(401).render("login-screen");
		res.end();
	}
};
// Verifica que el usuario tenga una cookie de acceso
const verifyAccessCookieMiddleware = (req, res, next) => {
	try {
		auth.verifyIdToken(req.headers.cookie.split("=")[1]).then((result) => {
			next();
		});
	} catch (error) {
		console.error(error);
		res.status(401).render("login-screen");
		return;
	}
};
// Verifica que el usuario esté autenticado
const verifyIdTokenMiddleware = (req, res, next) => {
	try {
		const result = auth
			.verifyIdToken(req.headers["authorization"].split(" ")[1])
			.then((result) => {
				if (!result) {
					res.status(401).render("login-screen");
					return;
				}
				setAccessTokenCookieMiddleware(req, res, next);
			});
	} catch (error) {
		console.error(error);
		res.status(401).render("login-screen");
		return;
	}
};
// Agrega el token de acceso a la cookie
const setAccessTokenCookieMiddleware = (req, res, next) => {
	res.cookie("access_token", req.headers["authorization"].split(" ")[1], {
		expires: new Date(Date.now() + 3600000), // 1 hora
		httpOnly: true, // Evita que el cliente acceda a la cookie desde JavaScript
	});
	next();
};
