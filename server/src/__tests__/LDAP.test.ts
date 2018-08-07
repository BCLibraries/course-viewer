import authenticate from '../auth/LDAP';
import User from "../auth/User";

it('rejects anonymous binds', async () => {
    return expect(authenticate('fakeuid', '')).rejects.toEqual('no anonymous binds');
});

it('rejects bad credentials', async () => {
    return expect(authenticate('fakeuid', 'notarealpass')).rejects.toEqual('bind failed');
});

// Requires LDAP_USER and LDAP_PASSWD environment variables be set in test configuration.
it('accepts good credentials', () => {
    expect.assertions(2);
    const uid = process.env.LDAP_USER ? process.env.LDAP_USER : '';
    const pass = process.env.LDAP_PASSWD ? process.env.LDAP_PASSWD : '';
    return authenticate(uid, pass)
        .then((user: User) => {
            expect(user.empty).toBe(false);
            expect(user.uid).toBe(process.env.LDAP_USER);
        });
});