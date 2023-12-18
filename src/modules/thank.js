import Cache from "../cache";
import Log from "./log";
import Setting from "../setting";

class Thank {
    data;
    thanked = false;

    constructor( { data } ) {
        this.data = data;

        if (Cache.thank[ this.data.detailId ] !== undefined) {
            Log(this.data.hash, 'thanked');

            this.thanked = true;
        }

    }

    async thank( { html } ) {
        return await new Promise(async resolve => {
            Log(this.data.hash, 'thanking...');

            let element = $('#saythanks a', html);
            if (element.length === 1) {
                GM_xmlhttpRequest({
                    method    : "GET",
                    url       : window.location.origin + '/' + 'ajax.php?action=say_thank&id=' + this.data.detailId,
                    onload    : res => {
                        if (typeof res.responseText === 'string' && res.responseText.includes('กดขอบคุณ')) {
                            Log(this.data.hash, 'thanked');

                            resolve(true);
                        } else {
                            Log(this.data.hash, 'thank fail!');
                            resolve(false);
                        }
                    },
                    ontimeout : () => resolve(false),
                    onerror   : () => resolve(false)
                });
            } else {
                Log(this.data.hash, 'already thanked');
                resolve(true);
            }
        }).then(status => {
            if (status === true) {
                Cache.set({ key : 'thank', data : { key : this.data.detailId, value : Cache.timestamp() } });
            }
        });
    }

    async hook( { html, self } ) {
        if (Setting.autoThankHook === false) return;

        return await new Promise(async resolve => {
            if (self.thanked === true) {
                resolve();
            }

            await self.thank({ html });
            resolve();
        });
    }

    static thankInDetail( element ) {
        Log('Thank in detail');
        let a = $('#saythanks a', element);

        if (a) {
            const onclick = a.attr('onclick');
            if(onclick){
                const id   = onclick.match(/sndReq\('action=say_thanks&id=(\d+)'/);
                $.ajax({
                    url: '/ajax.php',
                    type: 'GET',
                    data: 'action=say_thanks&id=' + id[1],
                    success: function (data) {
                        Log('send thank success.');
                        $('#saythanks').html(data);
                    }
                });
            }
        }

        //remove text thanks
        $('td.outer table[width="80%"] td.rowhead').each(function( index, item ){
            let text = $(item).html().trim();
            if(text === '<font color="black">ต้องการกด Thanks <br>กรุณาเลื่อนลงไปด้านล่าง<br>หรือคลิกที่ปุ่ม Download <br>จะมีหน้าให้กด' +
                ' Thanks เช่นกัน</font>'){
                $(item).html('<font color="#D91BEA">Download</font>');
            }
        });

        Log('Done');
    }
}

export default Thank;
