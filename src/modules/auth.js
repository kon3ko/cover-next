import Log from "./log";

class Auth {
    id;
    username;

    constructor() {
        Log('Auth');

        let a         = $('table.mainouter tr:nth-child(2):first td a[href^=\'userdetails.php\']');
        this.username = a.text();
        this.id       = a.attr('href').replace('userdetails.php?id=', '');

        Log('username: ' + this.username);
        Log('id: ' + this.id);

        Log('Done');
    }
}

export default Auth;