class Detail {
    id;
    html;
    table;

    constructor( { html, location } ) {
        this.html  = html;
        this.table = $('table[width="80%"]', html);
        this.id    = this.findId(location);
    }

    findId( location ) {
        let search;
        if (typeof location === "object") {
            search = location.search;
        } else {
            search = location.split("?")[ 1 ];
        }

        const params = new URLSearchParams(search);
        let id       = 0;
        for (const param of params) {
            if (param[ 0 ] === 'id') {
                id = param[ 1 ];
            }
        }

        return id;
    }
}

export default Detail;