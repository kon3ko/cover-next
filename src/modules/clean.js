import Setting from "../setting";

class Clean {

    constructor( { element } ) {
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

            //remove Advertising
            $('td.outer table[width="80%"] td.rowhead').each(function( index, item ){
                let text = $(item).html().trim();
                if(text === 'Advertising' || text === 'Advertising<br>'){
                   $('td.rowhead', element).each(function( tdIndex, tdItem ){
                       if(tdIndex === index){
                           $(tdItem).parent().remove();
                       }
                   });
                }
                if(text === 'ScreenShot'){
                    const trLeft = $('td[align="left"]', $(item).parent());
                    const a = $('a', trLeft);

                    if(a.length === 2){
                        a.eq(0).remove();
                        $('br', trLeft).remove();
                    }
                }
            })
        }

        //remove br in column download when bookmark and promote is removed
        if (Setting.cleanDetailBookmarks && Setting.cleanDetailPromote){
            $('br', $('tbody>tr:eq(0)>td:eq(1)', element)).remove();
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
