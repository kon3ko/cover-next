import Setting from "../setting";
import Log from "./log";
import Cache from "../cache";

class Download {
    link;
    data;

    constructor( { data } ) {
        this.data = data;

        Log(this.data.hash, 'download...');

        if (this.data.download !== undefined
            && Setting.downloadWithoutVip === false) {
            Log(this.data.hash, 'vip link');

            this.vip();
        }
    }

    vip() {
        this.link = window.location.origin + '/' + this.data.download;
    }

    async download() {
        if (this.link === undefined) {
            Log(this.data.hash, 'download link undefined!');
            Log(this.data.hash, 'try hook download...');

            let detail = await this.data.hook.detail();
            this.link  = $('a[title="Download this file"]', detail).attr('href');

            if (this.link === undefined) {
                Log(this.data.hash, 'download fail!');

                return;
            }
        }

        //download
        window.location.href = this.link;

        //render downloaded
        Download.downloaded({ data : this.data });
        Log(this.data.hash, 'download href');
    }

    static downloadedDetail( { html, detail } ) {
        Log('Downloaded...');

        let _html = typeof html === 'object' ? html.innerHTML : html;
        if (_html.indexOf('(Downloaded ไปแล้ว)') !== -1) {
            //set cache downloaded
            Cache.set({ key : 'downloaded', data : { key : detail.id, value : Cache.timestamp() } });

            Log('set downloaded and cache');
        }

        $(html).on('click', 'a[title="Download this file"]', () => {
            Log('Click Download');
            Log('set downloaded...');

            Cache.set({ key : 'downloaded', data : { key : detail.id, value : Cache.timestamp() } });

            Log('set downloaded and cache');
            Log('Done');
        });

        Log('Done');
    }

    static downloadedHook( { html, self } ) {
        Log(self.hash, 'hook downloaded...');

        if (html.body.innerHTML.indexOf('(Downloaded ไปแล้ว)') !== -1) {
            Download.downloaded({ data : self });
        }

        Log(self.hash, 'hook downloaded success');
    }

    static downloaded( { data } ) {
        //set cache downloaded
        Cache.set({ key : 'downloaded', data : { key : data.detailId, value : Cache.timestamp() } });

        if (Setting.downloaded === false) return;

        Log(data.hash, `downloaded ${data.hash}`);
        data.elements.title.addClass('downloaded');
    }
}

export default Download;