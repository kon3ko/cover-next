import Log from "./log";

class Auth {
    id;
    username;
    isPremium;

    constructor() {
        Log('Auth');

        this.detail();
        this.isPremium = this.premium();

        Log('username: ' + this.username);
        Log('id: ' + this.id);

        Log('Done');
    }

    detail() {
        const a = $('table.mainouter tr:nth-child(2):first td a[href^=\'userdetails.php\']');
        this.username = a.text();
        this.id = a.attr('href').replace('userdetails.php?id=', '');
    }

    premium() {
        const a = $('table.mainouter tr:nth-child(2):first td');

        return !!a.text().includes('Premium EXP.');
    }
}

export default Auth;
