import Setting from "../setting";
import Log from "./log";
import Auth from "./auth";

class Boot {
    constructor() {
        Log('Boot loading...');

        this.font();

        Log('Boot Done');
    }

    font() {
        Log('Font Change...');

        if(Number.isInteger(parseInt(Setting.fontSize))){
            Log('Font Size:', Setting.fontSize);

            $('body').css('font-size', Setting.fontSize + 'pt');
            $('td').css('font-size', Setting.fontSize + 'pt');
        }

        Log('Font Change Done');
    }
}

export default Boot;
