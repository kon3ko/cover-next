import Setting from "../setting";

class Clean {

    constructor( { element } ) {
        //logo
        if (Setting.cleanLogo) {
            $('img[src="include/logo_siambit.gif"]').remove();
        }

        //detail
        this.detail(element);
    }

    detail( element ) {
        //always change thank to download
        $('#saythankup').html(`<span>Download</span>`)

        if (Setting.cleanDetailBanner) {
            let banner = $('tr:first-child td:eq(1) a[target="_blank"]', element);
            if (banner) {
                banner.next().remove();
                banner.remove();
            }
        }

        if (Setting.cleanDetailDownloadImage) {
            $('img[src="pic/downloadpic.gif"]', element).remove();
        }

        if (Setting.cleanDetailBookmarks) {
            $('a[title="Bookmark File"]', element).remove();
            $('tr:first-child td:eq(1)', element).html(function () {
                return $(this).html().replace('&nbsp;&nbsp;', '');
            });
        }

        if (Setting.cleanDetailPromote) {
            $('a[title="Promote this Torrent"]', element).remove();
        }
    }
}

export default Clean;