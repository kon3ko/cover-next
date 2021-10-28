class StatusBar {
    static element    = null;
    static statusShow = false;
    static timeoutBar = 10; //seconds
    static code;

    static make( cache, message ) {
        this.panel();

        if(cache.data.welcomeMessage - cache.timestamp()  < 0){
            this.show(message, '#11324D');
            const timeout = cache.set({
                key : 'data',
                data : {
                    key : 'welcomeMessage',
                    value : cache.timestamp() + 3600
                }
            });
        }
    }

    static show( message, color ) {
        if (this.element === null) {
            this.element = $('#status-bar');
        }

        if (!this.statusShow) {
            this.statusShow = true;
            this.element.slideDown();
        }

        this.element.text(message).css({ color : color ?? '#056ad1' });

        this.hidePanel();
    }

    static hidePanel() {
        const rand = Math.random();
        this.code  = rand;
        let hide   = ( code ) => {
            if (this.code === code) {
                this.element.slideUp();
                this.statusShow = false;
            }
        };
        setTimeout(() => {
            hide(rand);
        }, this.timeoutBar * 1000);
    }

    static panel() {
        $('body').append($(`<div>`, { id : 'status-bar', class : 'status-bar' }));
    }
}

export default StatusBar;