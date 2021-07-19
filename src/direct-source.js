import DirectSource from "./modules/direct-source";

/*
 * Patterns
 * s = selector
 * m = meta
 * e = except
 * [find,new] = replace
 *
 */

const domains = {
    'postto.me'          : 's:1',
    'pic.8e88.in.th'     : 's:2',
    'img.clipxxx.live'   : 's:3',
    'i-pic.info'         : 's:4',
    'www.i-pic.info'     : 's:4',
    'img.thaibuzz.com'   : 's:5',
    'imgmak.com'         : 's:6',
    'www.imgbb.me'       : 'm:og:image',
    'imgbb.me'           : 'm:og:image',
    'www.picz.in.th'     : 'm:og:image',
    'picz.in.th'         : 'm:og:image',
    'www.imgtrue.com'    : 'm:og:image',
    'imgtrue.com'        : 'm:og:image',
    'imdb.com'           : 'm:og:image',
    'www.imdb.com'       : 'm:og:image',
    'ibb.co'             : 'm:og:image',
    'www.lmgbb.me'       : 'm:og:image',
    'roop.xyz'           : 'm:og:image',
    'www.roop.xyz'       : 'm:og:image',
    'bpicc.com'          : 'm:og:image',
    'www.bpicc.com'      : 'm:og:image',
    'bpicc.cc'           : 'm:og:image',
    'www.bpicc.cc'       : 'm:og:image',
    'lmgbb.me'           : 'm:og:image',
    'www.img.live'       : 'm:og:image',
    'img.live'           : 'm:og:image',
    '234.in.th'          : 'm:og:image',
    'www.234.in.th'      : 'm:og:image',
    'img.in.th'          : 'm:og:image',
    'www.img.in.th'      : 'm:og:image',
    'img.best-story.net' : ['viewer.php?file=', 'files/'],
    'uppic.cc'           : ['.cc/v', '.cc/d'],
    'uppicimg.com'       : ['.com/v/', '.com/s/'],
    'uppic.xyz'          : ['.xyz/image/', '.xyz/d/'],
    'imgur.com'          : 'c:imgur',
    'www.youtube.com'    : 'c:youtube',
    'youtube.com'        : 'c:youtube',
    'youtube.be'         : 'c:youtube',
};


/* Patterns arguments
 * attr = $.attr(attr)
 * selector = $(selector)
 *
 */
const patterns = {
    'default'    : {
        attr     : 'content',
        selector : 'meta[property=\'og:image\']',
    },
    's:1'        : {
        attr     : 'src',
        selector : 'div.image_view img',
    },
    's:2'        : {
        attr     : 'src',
        selector : 'div#image img',
    },
    's:3'        : {
        attr     : 'src',
        selector : 'div#main div.center img',
    },
    's:4'        : {
        attr     : 'src',
        selector : 'img#magnific-image',
    },
    's:5'        : {
        attr     : 'src',
        selector : 'img[alt=\'Free Image Hosting\']',
    },
    's:6'        : {
        attr     : 'src',
        selector : 'img#full_image',
    },
    'm:og:image' : {
        attr     : 'content',
        selector : 'meta[property=\'og:image\']',
    },
    'c:imgur'    : {
        sourceIf : ( { url } ) => url.replace('https://', '')
            .replace('http://', '')
            .startsWith('imgur.com/a/'),
        attr     : 'content',
        selector : 'meta[name=\'twitter:image\']',
        callback : [
            ( { url } ) => url,
            ( { url } ) => {
                let _url = url.replace('https://', '').replace('http://', '');
                if (_url.startsWith('imgur.com/')
                    && _url.lastIndexOf('.jpg') === -1
                    && _url.lastIndexOf('.jpeg') === -1
                    && _url.lastIndexOf('.gif') === -1
                    && _url.lastIndexOf('.png') === -1
                ) {
                    url = 'https://i.' + _url + '.jpg';
                }

                return url;
            }
        ]
    },
    'c:youtube'  : {
        sourceIf : false,
        callback : ( { url } ) => {
            let r, rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
            try {
                r = url.match(rx);
                r = 'https://img.youtube.com/vi/' + r[ 1 ] + '/maxresdefault.jpg';
            } catch (e) {
                r = url;
            }

            return r;
        }
    },
};

const directSource = new DirectSource(domains, patterns);

export default directSource;