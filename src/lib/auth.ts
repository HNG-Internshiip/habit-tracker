import { getUsers, saveUsers, getSession as readSession, saveSession, clearSession } from "./storage";

export type Session = {
	userId: string;
	email: string;
};

export type User = {
	id: string;
	email: string;
	password: string;
	createdAt: string;
};

export type AuthResult =
	| { ok: true; session: Session }
	| { ok: false; error: string };

// SIGN UP
export function signUp(email: string, password: string) {
	const users = getUsers();

	const exists = users.some(
		(u) => u.email.toLowerCase() === email.toLowerCase()
	);

	if (exists) return { ok: false, error: "User already exists" };

	const newUser = {
		id: crypto.randomUUID(),
		email,
		password,
		createdAt: new Date().toISOString(),
	};

	saveUsers([...users, newUser]);

	const session = { userId: newUser.id, email: newUser.email };
	saveSession(session);

	return { ok: true, session };
}

// LOGIN
export function logIn(email: string, password: string) {
	const users = getUsers();

	const user = users.find(
		(u) =>
			u.email.toLowerCase() === email.toLowerCase() &&
			u.password === password
	);

	if (!user) return { ok: false, error: "Invalid email or password" };

	const session = { userId: user.id, email: user.email };
	saveSession(session);

	return { ok: true, session };
}

// LOGOUT
export function logOut() {
	clearSession();
}

// SESSION (ONLY THIS ONE EXPORT)
export function getSession() {
	return readSession();
}