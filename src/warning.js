class Warning {
    static element    = null;
    static statusShow = false;
    static timeoutBar = 10; //seconds
    static code;
    static cache;

    static make( cache ) {
        this.cache = cache;

        if(cache.data.warning - cache.timestamp()  < 0){
            this.panel();
            this.show();
        }
    }

    static html(){
        return `<h5>แจ้งเตือน - Cover Next</h5>
                <div>หลังจากได้อัปเดตปลั๊กอินเป็นเวอร์ชั่น 2.00 ในหน้าเลือกไฟล์จะไม่มีรูปภาพให้ดูอีกต่อไปสำหรับสมาชิกที่ไม่ได้เป็น Premium ของ BearBit</div>
                <div>คุณสามารถอ่านรายละเอียดและเสนอความคิดเห็นได้ที่นี่ <a href="https://github.com/kon3ko/cover-next/discussions/7" target="_blank">https://github.com/kon3ko/cover-next/discussions/7</a></div>
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
    }

    static panel() {
        $('body').append($(`<div>`, { id : 'warning', class : 'warning' }));
    }
}

export default Warning;

