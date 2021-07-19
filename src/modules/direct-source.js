import Log from "./log";
import Hash from "hash.js";

class DirectSource {
    url;
    hash;
    domain;
    domains;
    patterns;

    constructor( domains, patterns ) {
        this.domains  = domains;
        this.patterns = patterns;
    }

    async get( url ) {
        Log('Direct source getting...');

        this.url    = url;
        this.hash   = Hash.sha1().update(this.url).digest("hex").substr(34);
        this.domain = this.extractHostname();

        Log(this.hash, `url: ${url}`);
        Log(this.hash, `domain: ${this.domain}`);

        //pattern replace
        if (typeof this.domains[ this.domain ] === 'object') {
            let result = this.replace(this.domains[ this.domain ][ 0 ], this.domains[ this.domain ][ 1 ]);

            Log(this.hash, `replace: ${result}`);
            Log('Done.');

            return result;
        }

        //direct
        if (this.isDirect()) {
            Log(this.hash, 'direct link.');
            Log('Done');

            return this.url;
        }

        //load pattern
        let mode, pattern;
        if (typeof this.domains[ this.domain ] === 'string') {
            mode    = this.domains[ this.domain ];
            pattern = this.patterns[ mode ];

            Log(this.hash, `mode: ${mode}`);
        } else {
            mode    = 'default';
            pattern = this.patterns[ mode ];

            Log(this.hash, `mode: default`);
        }


        //load source
        if (pattern !== undefined) {
            //run before callback
            if (pattern.callback) {
                Log(this.hash, 'run before callback...');
                Log(this.hash, `url: ${this.url}`);

                if (typeof pattern.callback === 'object') {
                    this.url = pattern.callback[ 0 ]({ url : this.url });
                } else {
                    this.url = pattern.callback({ url : this.url });
                }

                Log(this.hash, `url: ${this.url}`);
                Log(this.hash, 'run before callback done');
            }

            //source
            let link = this.url;
            if ((typeof pattern.sourceIf === 'function' && pattern.sourceIf({ url : this.url }))
                || pattern.sourceIf === undefined
                || pattern.sourceIf !== false) {

                Log(this.hash, 'load source...');

                let source = await this.loadSource(this.url);
                if (source !== null) {
                    Log(this.hash, 'load success');

                    link = $(pattern.selector, source).attr(pattern.attr);

                    Log(this.hash, `source is ${link}`);
                }

                if (link === undefined) {
                    Log(this.hash, `rollback source to ${this.url}`);

                    link = this.url;
                }
            }

            //run after callback
            if (pattern.callback) {
                Log(this.hash, 'run after callback...');
                if (typeof pattern.callback === 'object') {
                    Log(this.hash, `url: ${link}`);

                    link = pattern.callback[ 1 ]({ url : link });

                    Log(this.hash, `url: ${link}`);
                    Log(this.hash, 'run after callback done');
                }
            }

            if (link !== undefined) {
                Log('Done');

                return link;
            }

            Log(this.hash, 'fail!');
        }

        return url;
    }

    async loadSource( url ) {
        return await new Promise(resolve => {
            GM_xmlhttpRequest({
                method      : 'GET',
                url         : url,
                synchronous : true,
                onload      : function ( res ) {
                    resolve(new DOMParser().parseFromString(res.responseText, "text/html"));
                },
                ontimeout   : () => {
                    resolve(null);
                },
                onerror     : () => {
                    resolve(null);
                }
            });
        });
    }

    replace( search, newValue ) {
        return this.url.replace(search, newValue);
    }

    isDirect() {
        return this.url.match(/\.(jpeg|jpg|gif|png)$/) != null;
    }

    extractHostname() {
        let hostname;
        if (this.url.indexOf("//") > -1) {
            hostname = this.url.split('/')[ 2 ];
        } else {
            hostname = this.url.split('/')[ 0 ];
        }
        hostname = hostname.split(':')[ 0 ];
        hostname = hostname.split('?')[ 0 ];
        return hostname;
    }
}

export default DirectSource;