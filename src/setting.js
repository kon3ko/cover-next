import Log from "./modules/log";
import Serial from "./modules/serial";
import {Fancybox} from "@fancyapps/ui";
import category from "./category";
import Cache from "./modules/cache";

class Setting {
    static key                            = 'COVER_NEXT';
    static version                        = null;
    static serial                         = '';
    static cache                          = true;
    static cacheTimeout                   = 604800;
    static preview                        = true;
    static previewHover                   = true;
    static titleHover                     = true; //Donate Version
    static previewColumnMaxHeight         = 171; //Set false for use auto detect column height
    static previewMaxHeight               = 80;
    static previewMaxWidth                = 120;
    static previewFail                    = 'https://i.imgur.com/jaM7eqT.png?1';
    static previewExcept                  = 'https://i.imgur.com/blbuhiy.png?1';
    static exceptCategories               = ['man']; //Donate Version
    static expandButton                   = true;
    static downloadWarningSize            = 10; //GB
    static autoThankHook                  = true;
    static autoThankInDetail              = true;
    static album                          = true; //Donate Version
    static downloaded                     = true; //Donate Version
    static downloadedHook                 = false; //Donate Version
    static cacheDownloadedHookTimeout     = 21600;
    static downloadFinish                 = true; //Donate Version
    static downloadFinishCacheTimeout     = 300;
    static downloadFinishNewestHash       = null;
    static downloadFinishOldestAt         = 0;
    static downloadFinishNewestAt         = 0;
    static downloadFinishHistoricalDays   = 30;
    static downloadFinishHistoricalWorked = false;
    static downloadWithoutVip             = false;
    static fixImageOverScreen             = true;
    static cleanLogo                      = true;
    static cleanDetailBanner              = true; //Donate Version
    static cleanDetailDownloadImage       = true;
    static cleanDetailBookmarks           = true;
    static cleanDetailPromote             = true;

    static load() {
        Log('Load setting');
        let settingsFormStorage = localStorage.getItem(`${this.key}_SETTING`);
        if (settingsFormStorage) {
            try {
                settingsFormStorage = JSON.parse(settingsFormStorage);
            } catch (e) {
                settingsFormStorage = {};
            }
        }
        for (const settingsFormStorageKey in settingsFormStorage) {
            if (settingsFormStorage.hasOwnProperty(settingsFormStorageKey)
                && this.hasOwnProperty(settingsFormStorageKey)) {
                this[ settingsFormStorageKey ] = settingsFormStorage[ settingsFormStorageKey ];
            }
        }

        //donate version
        Setting.donateVersion();

        //plugin version
        try {
            Setting.version = GM_info.script.version;
        } catch (e) {
        }

        //panel
        Setting.panel();
    }

    static loadDefault() {
        localStorage.setItem(`${this.key}_SETTING`, JSON.stringify({
            serial : Setting.serial
        }));
    }

    static array() {
        return Object.getOwnPropertyNames(this)
            .filter(item =>
                !['undefined', 'function'].includes(typeof (this[ item ]))
                && !['length', 'name', 'prototype'].includes(item));
    }

    static save() {
        Log('Save setting');
        let settings = {};
        Setting.array().map(item => settings[ item ] = this[ item ]);

        localStorage.setItem(`${this.key}_SETTING`, JSON.stringify(settings));
    }

    static donateVersion() {
        if (Serial.check() !== Serial.dataReal()) {
            Setting.album             = false;
            Setting.downloaded        = false;
            Setting.downloadedHook    = false;
            Setting.titleHover        = false;
            Setting.cleanDetailBanner = false;
            Setting.downloadFinish    = false;
            Setting.exceptCategories  = [];

            return true;
        }

        return false;
    };

    static panel() {
        Log('Mount panel');
        $('body')
            .append(`<div class="setting"><img src="https://i.imgur.com/NMWP8lk.png" alt="Setting Cover Next" title="Setting Cover Next"></div>`)
            .append(`<div class="setting-panel"></div>`);

        //click
        $('.setting img').click(() => {
            new Fancybox([{ src : '#setting-panel', type : 'inline' }]);
        });
        $('.setting-panel').html(`<div id="setting-panel">
<h3>Cover Next</h3>
<h5>Version: ${Setting.version}</h5>
<h5>Github: <a href="https://github.com/kon3ko/cover-next" target="_blank">https://github.com/kon3ko/cover-next</a></h5>
<h5>Donate, Report: <a href="https://m.me/100001345584902" target="_blank">https://m.me/100001345584902</a></h5>
<br>
<form id="form-setting">
<div class="form-group">
    <label >หน้าปก</label><br>
    <div class="form-input">
        <input type="radio" name="preview" value="on"><span class="green">เปิด</span> 
        <input type="radio" name="preview" value="off"> <span class="red">ปิด</span>
    </div>
</div>

<div class="form-group">
<label >แสดงรูปใหญ่ (หน้าปก)</label><br>
    <div class="form-input">
        <input type="radio" name="previewHover" value="on"> <span class="green">เปิด</span> 
        <input type="radio" name="previewHover" value="off"> <span class="red">ปิด</span>
    </div>
    <span>เมื่อวางเมาส์ที่หน้าปก</span>
</div>

<div class="form-group donate">
<label class="donate">[Donate Version] แสดงรูปใหญ่ (รายการ)</label><br>
  <div class="form-input">
        <input type="radio" name="titleHover" value="on"> <span class="green">เปิด</span> 
        <input type="radio" name="titleHover" value="off"> <span class="red">ปิด</span>
    </div>
  <span>เมื่อวางเมาส์ที่ชื่อรายการ</span>
</div>

<div class="form-group">
<label >ปุ่มกดเพิ่มเติมใต้รายการ</label><br>
  <div class="form-input">
        <input type="radio" name="expandButton" value="on"> <span class="green">เปิด</span> 
        <input type="radio" name="expandButton" value="off"> <span class="red">ปิด</span>
    </div>
</div>

<!--<div class="form-group">-->
<!--<label >ขอบคุณอัตโนมัติ (หน้ารายการ)</label><br>-->
<!--  <div class="form-input">-->
<!--        <input type="radio" name="autoThankHook" value="on"> <span class="green">เปิด</span> -->
<!--        <input type="radio" name="autoThankHook" value="off"> <span class="red">ปิด</span>-->
<!--    </div>-->
<!--</div>-->

<div class="form-group">
<label >ขอบคุณอัตโนมัติ (หน้ารายละเอียด)</label><br>
  <div class="form-input">
        <input type="radio" name="autoThankInDetail" value="on"> <span class="green">เปิด</span> 
        <input type="radio" name="autoThankInDetail" value="off"> <span class="red">ปิด</span>
    </div>
</div>

<div class="form-group">
<label >ดาวน์โหลดด้วยปุ่ม VIP</label><br>
  <div class="form-input">
        <input type="radio" name="downloadWithoutVip" value="off"> <span class="green">เปิด</span> 
        <input type="radio" name="downloadWithoutVip" value="on"> <span class="red">ปิด</span>
    </div>
  <span>เฉพาะสมาชิกที่เป็น VIP เท่านั้น</span>
</div>

<div class="form-group donate">
<label class="donate">[Donate Version] อัลบั้ม</label><br>
  <div class="form-input">
        <input type="radio" name="album" value="on"> <span class="green">เปิด</span> 
        <input type="radio" name="album" value="off"> <span class="red">ปิด</span>
    </div>
  <span>คลิกที่รูปปกเพื่อใช้งาน</span>
</div>

<div class="form-group donate">
<label class="donate">[Donate Version] เปลี่ยนชื่อเป็นสีเทาหากโหลดไปแล้ว</label><br>
  <div class="form-input">
        <input type="radio" name="downloaded" value="on"> <span class="green">เปิด</span> 
        <input type="radio" name="downloaded" value="off"> <span class="red">ปิด</span>
    </div>
  <span>เฉพาะที่คุณดาวน์โหลดในเครื่องนี้เท่านั้นไม่ข้ามเครื่อง</span>
</div>

<div class="form-group donate">
<label class="donate">[Donate Version] เปลี่ยนชื่อเป็นสีเทาหากโหลดไปแล้ว (ย้อนหลัง)</label><br>
  <div class="form-input">
        <input type="radio" name="downloadFinish" value="on"> <span class="green">เปิด</span> 
        <input type="radio" name="downloadFinish" value="off"> <span class="red">ปิด</span>
    </div>
  <span>รายการที่ดาวน์โหลดไปแล้ว (ดึงย้อนหลังแค่ 30 วัน ไม่เกิน 100 หน้า)</span>
</div>

<div class="form-group">
<label >ลบโลโก้ด้านบน</label><br>
  <div class="form-input">
        <input type="radio" name="cleanLogo" value="on"> <span class="green">เปิด</span> 
        <input type="radio" name="cleanLogo" value="off"> <span class="red">ปิด</span>
    </div>
</div>

<div class="form-group donate">
<label class="donate">[Donate Version] ลบโฆษณา</label><br>
  <div class="form-input">
        <input type="radio" name="cleanDetailBanner" value="on"> <span class="green">เปิด</span> 
        <input type="radio" name="cleanDetailBanner" value="off"> <span class="red">ปิด</span>
    </div>
    <span>ทำงานเฉพาะในหน้ารายละเอียด</span>
</div>

<div class="form-group">
<label >ลบไอค่อนดาวน์โหลด</label><br>
  <div class="form-input">
        <input type="radio" name="cleanDetailDownloadImage" value="on"> <span class="green">เปิด</span> 
        <input type="radio" name="cleanDetailDownloadImage" value="off"> <span class="red">ปิด</span>
    </div>
  <span>ทำงานเฉพาะในหน้ารายละเอียด</span>
</div>

<div class="form-group">
<label >ลบคำสั่ง Bookmarks</label><br>
  <div class="form-input">
        <input type="radio" name="cleanDetailBookmarks" value="on"> <span class="green">เปิด</span> 
        <input type="radio" name="cleanDetailBookmarks" value="off"> <span class="red">ปิด</span>
    </div>
  <span>ทำงานเฉพาะในหน้ารายละเอียด</span>
</div>

<div class="form-group">
<label >ลบคำสั่ง Promote this Torrent</label><br>
  <div class="form-input">
        <input type="radio" name="cleanDetailPromote" value="on"> <span class="green">เปิด</span> 
        <input type="radio" name="cleanDetailPromote" value="off"> <span class="red">ปิด</span>
    </div>
  <span>ทำงานเฉพาะในหน้ารายละเอียด</span>
</div>

<div class="form-group donate">
<label class="donate">[Donate Version] หมวดหมู่ที่ยกเว้น</label><br>
  <div class="form-input">
        <select name="exceptCategories" multiple>
            <option>ไม่ยกเว้น</option>
            ${category.map(item => `<option value="${item.key}">${item.title}</option>`)}
        </select>
    </div>
  <span>ไม่แสดงภาพหน้าปกหมวดหมู่ที่เลือก, กด Ctrl ค้างไว้เพื่อเลือกมากกว่า 1 ตัวเลือก</span>
</div>

<div class="form-group">
<label >Donate Serial Key</label><br>
  <div class="form-input">
        <input type="text" name="serial" >
    </div>
  <span>ใส่ซีเรียลคีย์เพื่อเปิดใช้ Donate Version</span>
</div>
  
</form> 
</div>`);

        $('#form-setting').append($('<button>', { type : 'button', text : 'บันทึกการตั้งค่า' }).click(() => {
            //radio
            $('#form-setting input[type="radio"]:checked').each(( index, input ) => {
                let _input                     = $(input);
                Setting[ _input.attr('name') ] = $(input).val() === 'on';
            });
            //text
            $('#form-setting input[type="text"]').each(( index, input ) => {
                let _input                     = $(input);
                Setting[ _input.attr('name') ] = $(input).val();
            });
            //select
            $('#form-setting select[multiple]').each(( index, input ) => {
                let _input                     = $(input);
                Setting[ _input.attr('name') ] = $(input).val();
            });
            Setting.donateVersion();
            Setting.save();
            alert('บันทึกการตั้งค่าเรียบร้อยแล้ว กรุณารีโหลดหน้าเว็บใหม่อีกครั้ง');
        })).append($('<button>', { type : 'button', text : 'คืนค่าเดิม', style : 'margin-left:10px;' }).click(() => {
            if (confirm('คุณแน่ใจว่าต้องการคืนค่าตั้งค่าเป็นค่าเริ่มต้นและล้างแคชด้วย?')) {
                Setting.loadDefault();
                Cache.clean();
                alert('คืนค่าและล้างแคชเรียบร้อยแล้ว ระบบจะรีเฟรสหน้าเว็บใหม่อีกครั้ง');
                window.location.reload();
            }
        })).append($('<button>', { type : 'button', text : 'ล้างแคช', style : 'margin-left:10px;' }).click(() => {
            if (confirm('คุณแน่ใจว่าต้องการล้างแคช?')) {
                Cache.clean();
                alert('ล้างแคชเรียบร้อยแล้ว ระบบจะรีเฟรสหน้าเว็บใหม่อีกครั้ง');
                window.location.reload();
            }
        }));

        // new Fancybox([{ src : '#setting-panel', type : 'inline' }]);

        //donate only
        if (Setting.donateVersion()) {
            $('.donate .form-input').addClass('disabled');
            $('.donate .form-input input').prop('disabled', true);
            $('.donate .form-input select').prop('disabled', true);
        }

        //data
        Setting.array().map(item => {
            if (typeof Setting[ item ] === 'boolean') {
                $(`input:radio[name=${item}]`).filter(`[value=${Setting[ item ] ? 'on' : 'off'}]`).prop('checked', true);
            }

            if (Array.isArray(Setting[ item ])) {
                $(`select[name='exceptCategories']`).val(Setting[ item ]);
            }

            if (typeof Setting[ item ] === 'string') {
                let _input = $(`input[name=${item}]`);
                if (_input && _input.length === 1) {
                    _input.val(Setting[ item ]);
                }
            }
        });
    }
}

export default Setting;