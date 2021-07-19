import {Fancybox} from "@fancyapps/ui";
import Setting from "../setting";
import Cache from "../cache";

class Album {
    rows;

    constructor( { rows } ) {
        this.rows = rows.filter(( { data } ) => !data.except);

        this.rows.map(( { data, cover }, index ) => {
            cover.preview.click(() => {
                new Fancybox(this.rows.map(( { data, button, cover : coverItem } ) => ({
                    src     : coverItem.source ?? Setting.previewFail,
                    type    : 'image',
                    caption : this.caption(data),
                })), {
                    startIndex : index,
                    click      : null,
                    infinite   : false
                });
            });
        });
    }

    caption( data ) {
        return `
        <a href='${data.detailLink}' target='_blank'>${data.title}</a>
        <br>
        <button onclick='javascript:jQuery("#download_${data.id}").click()'>Download${Cache.downloaded[ data.detailId ] ? ' (ดาวน์โหลดไปแล้ว)' : ''}</button> 
        ขนาด: ${data.size} | เสร็จ: ${data.downloaded} | ปล่อย: ${data.seed} | ดูด: ${data.peer}
        `;
    }

}

export default Album;