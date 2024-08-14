import Setting from "./setting";

class Warning {
    static element    = null;
    static statusShow = false;
    static timeoutBar = 10; //seconds
    static code;
    static cache;

    static make( cache ) {
        this.cache = cache;

        if(cache.data.warning - cache.timestamp()  < 0 || cache.data.warningCode !== Setting.version){
            this.panel();
            this.show();
        }
    }

    static html(){
        return `<h5>แจ้งเตือน - Cover Next ` + Setting.version + `</h5>
                <div style="color:green;font-weight: 600">คุณกำลังใช้ปลั๊กอิน Cover Next เป็นปลั๊กอินที่แจกฟรี! <a href="https://github.com/kon3ko/cover-next" target="_blank">(รายละเอียด คลิก!)</a><br>โปรดระวังผู้ไม่หวังดีนำมาหลอกลวงหรือขายให้แก่คุณ</div>
                <div>อัปเดตนี้อาจจะเป็นอัปเดตสุดท้าย (v2.2x) ช่วงนี้ผมไม่ได้ว่างมาทำงานหน้าคอมเลย หากมีปัญหาให้เปิด <a href="https://github.com/kon3ko/cover-next/issues" target="_blank">Issue</a> ไว้นะครับ</div>
                <div>ปิดการ Donation เพราะทุกคนทักมาหาผมเพื่อให้แก้ปัญหาหรือแจ้งปัญหาทางเฟสเท่านั้น คงเพราะมันสะดวกทุกคนแต่ผมไล่ตอบทุกคนไม่สะดวกจริง ๆ ครับ</a></div>
                <div style="color:darkviolet">เซิร์ฟเวอร์ Cache ไม่มีให้ใช้งานแล้ว หากทางเว็บเอารูปกล้องออกทำใจกันรอเลยครับ</div>
                <br>
                <button id="warning-close">ปิด</button> (หน้าต่างนี้จะขึ้นมาทุก 1 เดือนไม่ต้องตกใจครับ)`;
    }

    static show() {
        if (this.element === null) {
            this.element = $('#warning');
        }

        if (!this.statusShow) {
            this.statusShow = true;
            this.element.fadeIn();
        }

        this.element.html(this.html());

        $('#warning-close').click(() => {
            this.hidePanel();
        });
    }

    static hidePanel() {
        this.element.fadeOut();
        this.statusShow = false;

        this.cache.set({
            key : 'data',
            data : {
                key : 'warning',
                value : this.cache.timestamp() + 2592000
            }
        });

        this.cache.set({
            key : 'data',
            data : {
                key : 'warningCode',
                value : Setting.version,
            }
        });
    }

    static panel() {
        $('body').append($(`<div>`, { id : 'warning', class : 'warning' }));
    }
}

export default Warning;

