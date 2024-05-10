import Head from "./modules/head";
import PassData from "./modules/pass-data";
import Cover from "./modules/cover";
import Button from "./modules/button";
import Download from "./modules/download";
import HookDetail from "./modules/hook-detail";
import Setting from "./setting";
import Cache from "./cache";
import ServerCache from "./modules/server-cache";
import Thank from "./modules/thank";
import Clean from "./modules/clean";
import Album from "./modules/album";
import Detail from "./modules/detail";
import Boot from "./modules/boot";
import './template';
import Auth from "./modules/auth";
import DownloadFinish from "./modules/download-finish";
import StatusBar from "./status-bar";
import Warning from "./warning";

//run
(async() => {
    //setting
    Setting.load();

    //Boot
    const boot = new Boot();

    //status bar
    StatusBar.make(Cache, `คุณกำลังใช้ Covernext v${Setting.version} ปลั๊กอินสำหรับ BearBit คุณสามารถตั้งค่าได้ที่ฟันเฟืองมุมล่างขวามือ :)`);

    //Auth
    const auth = new Auth();

    //Server Cache
    const serverCache = new ServerCache();

    //warning
    Warning.make(Cache);

    //working
    if([
        '/viewno18.php',
        '/viewbr.php',
        '/upfinish.php',
        '/viewno18sbx.php',
        '/viewno18sb.php',
        '/viewbrsb.php',
    ].includes(window.location.pathname)) {
        //check server cache when user is not premium
        let status = false;
        try{
            status = await serverCache.check();
        }catch(e) {
            console.error(e);
        }
        if(status !== true) {
            StatusBar.bottom('เชื่อมต่อกับ Server Cache ล้มเหลว! <a href="https://github.com/kon3ko/cover-next/issues" target="_blank">แจ้งปัญหาที่นี่</a>');
        }

        //head
        let tr = $('table.mainouter>tbody>tr>td[align="center"]>table[width="100%"]>tbody>tr');
        let head = new Head({ element: tr.get(0), itemLength: tr.length, auth: auth });
        let rows = [];

        //remove head row
        tr.splice(0, 1);

        //loop row
        const covers = [];
        tr.each((index, item) => {
            const data = new PassData({ element: item, head });

            //hook detail
            let thank = new Thank({ data });
            data.hook = new HookDetail({
                data: data, hook: [
                    { callback: thank.hook, self: thank },
                    { callback: Download.downloadedHook, self: data }
                ]
            });

            //cover
            const cover = new Cover({
                cover: data.cover,
                data,
                auth,
            });
            covers.push(cover);


            //add column cover
            if(Setting.preview === true && (auth.isPremium === true || ServerCache.status)) {
                $(data.td.get(0)).after(cover.html);
            }

            //button
            const button = new Button({ data, cover });

            //add column cover
            $(data.td.get(1)).append(button.html);

            //downloaded
            if(Cache.downloaded[data.detailId] !== undefined) Download.downloaded({ data });

            //remove bg first column
            const columnColor = $(data.td.get(0)).attr('bgcolor');
            if(!/^#[0-9A-F]{6}$/i.test(columnColor)) {
                $(data.td.get(0)).attr('bgcolor', '');
            }

            //row
            rows.push({
                data: data,
                cover: cover,
                thank: thank,
                button: button,
            });
        });

        //covers
        if(ServerCache.status === true && auth.isPremium === false) {
            await serverCache.get(covers.map(cover => cover.data.detailId));
        }
        covers.forEach((cover) => {
            cover.nextTick();
        });

        //album
        if(Setting.album === true) {
            new Album({ rows });
        }

        //download finish
        if(Setting.downloadFinish === true) {
            let downloadFinish = new DownloadFinish({ auth: auth });
            downloadFinish.init({ rows });
        }
    }

    //detail
    if(window.location.pathname === '/details.php') {
        let detail = new Detail({
            html: document.body,
            location: window.location,
        });

        //add id to table detail
        detail.table.attr('id', 'detail');

        //fix image over screen
        if(Setting.fixImageOverScreen === true) {
            detail.table.attr('class', 'fix-image-over-screen');
        }

        //auto thank
        if(Setting.autoThankInDetail === true) {
            Thank.thankInDetail(detail.table);
        }

        //downloaded
        Download.downloadedDetail({ html: detail.html, detail: detail });

        //clean
        let clean = new Clean({ element: detail.table });
    }

    //download finish
    if(Setting.downloadFinish === true) {
        if(window.location.pathname === '/downfinish.php') {
            let downloadFinish = new DownloadFinish({ auth: auth });
            downloadFinish.passData({ html: document.body });
        }
    }
})();
