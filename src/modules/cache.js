import Setting from "../setting";
import Log from "./log";

class Cache {
    downloaded = {};
    source     = {};
    thank      = {};
    detail     = {};
    data       = {
        downloadFinishTimeout : 0,
        welcomeMessage        : 0,
    };
    code;

    constructor() {
        Log('Cache loading...');

        this.read();

        Log('Done');
    }

    set( { key, data } ) {
        this[ key ][ data.key ] = data.value;
        let rand                = Math.random();
        this.code               = rand;
        setTimeout(() => this.write(rand), 2000);

        Log(`set cache ${key}: ${data.key}, ${data.value?.source ?? data.value}`);
    }

    read() {
        if (Setting.cache === false) return;

        let caches = localStorage.getItem(`${Setting.key}_CACHE`);
        if (caches) {
            try {
                caches = JSON.parse(caches);
            } catch (e) {
                caches = {};
            }
        }
        this.downloaded = { ...this.downloaded, ...caches?.downloaded };
        this.source     = { ...this.source, ...caches?.source };
        this.thank      = { ...this.thank, ...caches?.thank };
        this.detail     = { ...this.detail, ...caches?.detail };
        this.data       = { ...this.data, ...caches?.data };
    }

    write( code ) {
        if (Setting.cache === false) return;

        if (this.code === code) {
            this.timeout();

            localStorage.setItem(`${Setting.key}_CACHE`, JSON.stringify({
                downloaded : { ...this.downloaded },
                source     : { ...this.source },
                thank      : { ...this.thank },
                detail     : { ...this.detail },
                data       : { ...this.data },
            }));

            Log('write cache');
        }
    }

    timeout() {
        Log('clear source timeout');

        Object.keys(this.source).forEach(key => {
            if (!this.source[ key ].hasOwnProperty('timeout')) {
                this.source[ key ].timeout = this.timestamp() + Setting.cacheTimeout;
            } else if (this.source[ key ].timeout < this.timestamp()) {
                delete this.source[ key ];

                Log(`delete cache ${key}`);
            }
        });
    }

    timestamp() {
        return (Date.now() / 1000 | 0);
    }

    static clean() {
        localStorage.setItem(`${Setting.key}_CACHE`, '{}');
    }

}

export default Cache;