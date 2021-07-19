import CryptoJS from "crypto-js";
import Setting from "../setting";

class Serial {
    static check() {
        let uNsEeKrO = $((new Serial).data()).attr({ '\x64\x61\x74\x61\x2d\x78' : '\x79' }).text();
        let data     = { t : 0 };
        try {
            data = CryptoJS.AES.decrypt(Setting.serial, uNsEeKrO).toString(CryptoJS.enc.Utf8);
            data = JSON.parse(data);
        } catch {
        }

        return Date.now() / 1000 < data.t ? data?.u : null;
    }

    data() {
        return CryptoJS.AES
            .decrypt('U2FsdGVkX19tLII5UcqvgeBsJZ7uIEQ2G5DNi/k1gQum8XVtEXEJg2v1cJPKi3FMhOJFDldIl4R0BZn/XoNMHaagVD7MSzU6Q2Te0PVaoq+YkN6iwYyNRIPSiRbkBijh', String.fromCharCode(78, 69, 75, 79))
            .toString(CryptoJS.enc.Utf8);
    }

    static dataReal() {
        let cs = ['\x79\x5d', '\x78\x3d', '\x64\x61\x74', '\x61\x2d', '\x61\x5b'];
        return $(cs[ 4 ] + cs[ 2 ] + cs[ 3 ] + cs[ 1 ] + cs[ 0 ]).text();
    }
}

export default Serial;