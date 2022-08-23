import Log from "./log";
import Cache from "../cache";
import Setting from "../setting";
import Hash from "hash.js";
import Download from "./download";
import StatusBar from "../status-bar";

class DownloadFinish {
    auth;
    maxLoop = 100;
    rows;

    constructor( { auth } ) {
        this.auth = auth;
        Log('Download Finish');
    }

    init( { rows } ) {
        this.rows = Array.isArray(rows) ? rows : [];
        this.historical().then(r => {
            Log('download finish historical success');
            this.sync().then(r => Log('download finish sync success'));
        });
    }

    async sync() {
        Log(`load sync...`);

        //check cache
        if (Cache.data.downloadFinishTimeout >= (Cache.timestamp() - Setting.downloadFinishCacheTimeout)) {
            Log(`skip, wait ${Setting.downloadFinishCacheTimeout - (Cache.timestamp() - Cache.data.downloadFinishTimeout)} seconds!`);
            return;
        }

        let loop  = 0;
        let found = undefined;
        do {
            loop++;
            Log('loop: ' + loop);
            StatusBar.show('กำลังซิงค์ข้อมูลที่ดาวน์โหลดไปแล้ว #' + loop);

            let html = await this.data({ page : loop - 1 });
            let data = this.passData({ html : html });

            Log('newest: ' + new Date(data.newest * 1000));
            Log('newest at: ' + new Date(Setting.downloadFinishNewestAt * 1000));

            //found last timestamp
            found = data.items.find(element => element.hash === Setting.downloadFinishNewestHash);

            Log('found: ' + (found !== undefined ? 'true' : 'false'));
        } while (found === undefined && loop < this.maxLoop);

        StatusBar.show(`ซิงค์ข้อมูลที่เคยดาวน์โหลดเรียบร้อยแล้ว (ทุก ๆ ${Setting.downloadFinishCacheTimeout / 60} นาที)`,'#089d1a');

        //cache
        Cache.set({ key : 'data', data : { key : 'downloadFinishTimeout', value : Cache.timestamp() } });
    }

    async historical() {
        if (Setting.downloadFinishHistoricalWorked === false) {
            Log(`load historical ${Setting.downloadFinishOldestAt} days`);
            let loop = 0;
            do {
                loop++;
                Log('loop: ' + loop);

                StatusBar.show('กำลังโหลดข้อมูลที่ดาวน์โหลดไปแล้ว #' + loop);

                let html = await this.data({ page : loop - 1 });
                let data = this.passData({ html : html });

                Log('oldest: ' + new Date(data.oldest * 1000));
                Log('historical days: ' + new Date((Cache.timestamp() - (Setting.downloadFinishHistoricalDays * 86400)) * 1000));
            } while (
                (
                    Setting.downloadFinishOldestAt > (Cache.timestamp() - (Setting.downloadFinishHistoricalDays * 86400)) ||
                    Setting.downloadFinishOldestAt === 0
                ) && loop < this.maxLoop
                );

            StatusBar.show(`โหลดข้อมูลที่เคยดาวน์โหลดเรียบร้อยแล้ว`,'#089d1a');

            Setting.downloadFinishHistoricalWorked = true;
            Setting.save();
        }
    }

    async data( { page } ) {
        Log('get page ' + page);
        return await new Promise(resolve => {
            GM_xmlhttpRequest({
                method      : 'GET',
                url         : location.origin + '/downfinish.php?id=' + this.auth.id + '&page=' + page,
                synchronous : true,
                onload      : res => {
                    Log('load success page ' + page);
                    resolve(new DOMParser().parseFromString(res.responseText, "text/html"));
                },
                ontimeout   : () => {
                    Log('timeout page ' + page);
                    resolve(null);
                },
                onerror     : () => {
                    Log('error page ' + page);
                    resolve(null);
                }
            });
        });
    }

    passData( { html } ) {
        Log('pass data...');

        let data            = {
            newest : 0,
            oldest : 0,
            items  : [],
        };
        let newestHash      = Setting.downloadFinishNewestHash;
        let newestTimestamp = Setting.downloadFinishNewestAt;
        let oldestTimestamp = Cache.timestamp();
        let tr              = $('form>table tr', html);
        tr.each(( index, item ) => {
            let datum = {};
            if (index !== 0) {
                let title   = $('a', $('td', item).get(1)).first();
                datum.id    = /id=([0-9]+)/.exec(title.attr('href'))[ 1 ];
                datum.title = title.text();

                let downloadAt   = $($('td', item).get(6)).text();
                datum.downloadAt = new Date(
                    parseInt(downloadAt.substr(6, 4)),
                    parseInt(downloadAt.substr(3, 2)) - 1,
                    parseInt(downloadAt.substr(0, 2)),
                    parseInt(downloadAt.substr(10, 2)),
                    parseInt(downloadAt.substr(13, 2)),
                    parseInt(downloadAt.substr(16, 2)),
                );

                //timestamp
                datum.timestamp = datum.downloadAt / 1000;

                //hash
                datum.hash = Hash.sha1().update(datum.id + datum.timestamp).digest('hex');

                if (datum.timestamp >= newestTimestamp) {
                    newestTimestamp = datum.timestamp;
                    newestHash      = datum.hash;
                }

                if (datum.timestamp < oldestTimestamp) {
                    oldestTimestamp = datum.timestamp;
                }


                Log(datum.id, `download finish ${datum.title} ${datum.downloadAt}`);
                Log(datum.id, `hash: ${datum.hash}`);

                //cache downloaded

                let row = this.rows.find(element => element.data.detailId === datum.id);
                if (row) {
                    this.downloaded({ data : row.data });
                } else {
                    this.downloaded({ id : datum.id, timestamp : datum.timestamp });
                }

                data.items.push(datum);
            }
        });

        data.newest = newestTimestamp;
        data.oldest = oldestTimestamp;
        this.updatedAt({ newest : newestTimestamp, newestHash : newestHash, oldest : oldestTimestamp });

        return data;
    }

    updatedAt( { newestHash, newest, oldest } ) {
        Setting.downloadFinishNewestHash = newestHash;
        Setting.downloadFinishNewestAt   = newest;
        Setting.downloadFinishOldestAt   = oldest;
        Setting.save();

        Log('set download finish newest hash: ' + newestHash);
        Log('set download finish newest: ' + newest + '( ' + new Date(newest * 1000) + ')');
        Log('set download finish oldest: ' + oldest + '( ' + new Date(oldest * 1000) + ')');
    }

    downloaded( { data, id, timestamp } ) {
        if (data !== undefined) {
            Download.downloaded({ data });
        } else {
            //set cache downloaded
            Cache.set({ key : 'downloaded', data : { key : id, value : timestamp } });

            Log('set downloaded and cache ' + id);
        }
    }
}

export default DownloadFinish;