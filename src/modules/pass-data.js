import Cover from './cover';
import Log from "./log";
import Hash from "hash.js";
import Setting from "../setting";

class PassData {
    element;
    td;
    head;
    hash;
    id;
    title;
    link;
    download;
    category;
    size;
    downloaded;
    seed;
    peer;
    bgColor;
    cover;
    detailLink;
    detailId;
    hook;
    locked   = false;
    except   = false;
    elements = {};

    constructor( { element, head } ) {
        Log('Pass data');

        this.element = element;
        this.head    = head;

        this.convert();

        Log('Done');
    }

    convert() {
        this.td = $('td', this.element);

        //title
        let _title          = $('a:first-child b', this.td.get(1)).first();
        this.title          = _title.text();
        this.elements.title = _title;

        //check locked
        if ($('font b', this.td.get(1)).text() === 'Locked !!') {
            this.locked = true;
        }

        //Link
        this.link = _title.parent();
        if (this.link.length > 0) {
            if (this.link.get(0).tagName !== 'A') {
                this.link = this.link.parent();
            }
            this.link = this.link.attr('href');
        }

        //id
        this.id = Hash.sha1().update(this.link).digest('hex');

        //hash
        this.hash = this.id.substr(34);

        //cover
        let _cover = $(window.location.pathname === '/upfinish.php'
            ? 'td a>img[src="/pic/cam.gif"]'
            : 'td[width="900"] a>img[src="pic/cams.gif "]', this.element).parent();
        if (_cover.is('a')) {
            this.cover = _cover.attr('href');
        }

        //detail link and id
        this.detailLink = $('a', this.td.get(1)).first()?.attr('href');
        this.detailId   = /id=([0-9]+)/.exec(this.detailLink)[ 1 ];

        //download
        this.elements.download = $('td[width="900"] a>img[src="pic/downloaded.gif"]', this.element).parent();
        this.download = this.elements.download?.attr('href');

        //category
        this.category = $('img', this.td.get(0)).first()?.attr('src').replace('pic/categories/cat-', '')
            .replace('pic/categories/', '')
            .replace('.gif', '')
            .replace('.png', '')
            .toLowerCase();

        //from index
        this.size       = this.td.get(this.head.size)?.textContent;
        this.downloaded = this.td.get(this.head.downloaded)?.textContent;
        this.seed       = this.td.get(this.head.seed)?.textContent;
        this.peer       = this.td.get(this.head.peer)?.textContent;

        //background color
        this.bgColor = $(this.td.get(0)).attr('bgcolor');

        //except category or locked
        this.except = Setting.exceptCategories.includes(this.category) || this.locked;

        Log(this.hash, `title: ${this.title}`);
        Log(this.hash, `locked: ${this.locked}`);
        Log(this.hash, `link: ${this.link}`);
        Log(this.hash, `id: ${this.id}`);
        Log(this.hash, `hash: ${this.hash}`);
        Log(this.hash, `cover: ${this.cover}`);
        Log(this.hash, `detail Link: ${this.detailLink}`);
        Log(this.hash, `detail Id: ${this.detailId}`);
        Log(this.hash, `download: ${this.download}`);
        Log(this.hash, `category: ${this.category}`);
        Log(this.hash, `size: ${this.size}`);
        Log(this.hash, `downloaded: ${this.downloaded}`);
        Log(this.hash, `seed: ${this.seed}`);
        Log(this.hash, `peer: ${this.peer}`);
        Log(this.hash, `bg Color: ${this.bgColor}`);
        Log(this.hash, `except: ${this.except}`);
    }

}

export default PassData;