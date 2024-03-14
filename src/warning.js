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
        return `<h5>แจ้งเตือน - Cover Next</h5>
                <div style="color:green;font-weight: 600">คุณกำลังใช้ปลั๊กอิน Cover Next เป็นปลั๊กอินที่แจกฟรี! <a href="https://github.com/kon3ko/cover-next" target="_blank">(รายละเอียด คลิก!)</a><br>โปรดระวังผู้ไม่หวังดีนำมาหลอกลวงหรือขายให้แก่คุณ</div>
                <div>หลังจากได้อัปเดตปลั๊กอินเป็นเวอร์ชั่น 2.00 ในหน้าเลือกไฟล์จะไม่มีรูปภาพให้ดูอีกต่อไปสำหรับสมาชิกที่ไม่ได้เป็น Premium ของ BearBit</div>
                <div>คุณสามารถอ่านรายละเอียดและเสนอความคิดเห็นได้ที่นี่ <a href="https://github.com/kon3ko/cover-next/discussions/7" target="_blank">https://github.com/kon3ko/cover-next/discussions/7</a></div>
                <div style="color:darkviolet">อัปเดตล่าสุด ทดลองเซิร์ฟเวอร์ Cache 1 เดือน (อย่าลืมเข้าไปอ่านรายละเอียดในลิงก์ด้านบนนะครับ)</div>
                <br>
                <button id="warning-close">ปิด</button>`;
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

