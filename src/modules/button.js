import Download from "./download";
import {Fancybox} from "@fancyapps/ui";
import de from "@fancyapps/ui/src/Fancybox/l10n/de";
import Setting from "../setting";
import Log from "./log";

class Button {
    download    = $('<button>', { class : 'minimal' });
    description = $('<button>', { class : 'minimal' });
    zoom        = $('<button>', { class : 'minimal' });
    html        = $('<div>', { class : 'ZSS_manager' });
    data;
    cover;

    constructor( { data, cover } ) {
        this.data  = data;
        this.cover = cover;

        //btn vip click
        this.btnVIP();

        if (Setting.expandButton === false) return;

        this.button();

        //add button
        this.html.append([
            $('<hr>'),
            !this.data.locked ? this.download : '',
            this.description,
            this.data.cover ? this.zoom : ''
        ]);
    }

    button() {
        //download
        this.btnDownload();

        //description
        this.btnDescription();

        //zoom
        this.btnZoom();
    }

    btnVIP() {
        if (this.data.elements.download) {
            this.data.elements.download.click(() => {
                Log(this.data.hash, `vip download click`);

                Download.downloaded({ data : this.data });
            });
        }
    }

    btnDescription() {
        this.description.html(`<img src="https://i.imgur.com/WbP1rKF.png" alt="view"/> View<span></span>`);

        this.description.click(async () => {
            let html = `<div id="content_${this.data.detailId}"><img src='https://i.imgur.com/j5kbXsd.gif' alt='loading' class='zss_center' /></div>`;

            Fancybox.show([
                {
                    src  : html,
                    type : "html",
                },
            ]);

            //hook detail
            let detail = await this.data.hook.detail();
            let column = $('td.outer table[width="80%"]', detail).find('td');
            let index  = column.toArray().findIndex(( item ) => {
                return $(item).text() === 'Description';
            });

            $(`#content_${this.data.detailId}`).html(column.get(++index).innerHTML);
        });
    }

    btnZoom() {
        this.zoom.html(`<img src="https://i.imgur.com/nuY8ZFZ.png" alt="zoom"/> Zoom<span></span>`);

        this.zoom.click(() => {
            Fancybox.show([
                {
                    src  : this.cover.source,
                    type : "image",
                },
            ]);
        });
    }

    btnDownload() {
        //id
        this.download.attr('id', `download_${this.data.id}`);

        //check size
        if (this.data.size.indexOf('GB') >= 0
            && this.data.size.match(/\d+/g)[ 0 ] > Setting.downloadWarningSize) {
            this.download
                .addClass('download-high')
                .html(`<img src="https://i.imgur.com/U37rA2p.png"  alt="download"/> Download ${this.data.size}<span></span>`);
        } else {
            this.download
                .addClass('download')
                .html(`<img src="https://i.imgur.com/ryI2wh6.png"  alt="download"/> Download ${this.data.size}<span></span>`);
        }

        this.download.click(() => {
            let download = new Download({ data : this.data });
            let loading  = this.loading(this.download);

            download.download().then(() => {
                this.clearLoading(loading);
            });
        });
    }

    loading( buttonElement ) {
        this.download.prop('disabled', true)
            .addClass('disabled');

        return setInterval(() => {
            let element = $('span', buttonElement);
            switch (element.text()) {
                case '...':
                    element.text('.');
                    break;
                case '..':
                    element.text('...');
                    break;
                case '.':
                    element.text('..');
                    break;
                default:
                    element.text('.');
            }
        }, 500);
    }

    clearLoading( loading ) {
        clearInterval(loading);
        $('span', this.download).text('');
        this.download.prop('disabled', false)
            .removeClass('disabled');
    }
}

export default Button;