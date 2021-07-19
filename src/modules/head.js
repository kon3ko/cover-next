import Log from "./log";
import Setting from "../setting";

class Head {
    element;
    size;
    downloaded;
    seed;
    peer;
    progressBar = {
        all      : 0,
        run      : -1,
        template : $("<span>", { title : 'Direct source status.' })
    };

    constructor( { element, itemLength } ) {
        this.element         = element;
        this.progressBar.all = itemLength - 1;

        Log('Head...');
        Log('find index');
        //find index
        let td = $('td', element).each(( index, td ) => {
            if (['ขนาด', 'ขนาดไฟล์'].includes(td.textContent)) this.size = index;
            if (['เสร็จ', 'โหลดเสร็จ', 'คนโหลดเสร็จ'].includes(td.textContent)) this.downloaded = index;
            if (['ปล่อย', 'Seeder', 'คนปล่อย'].includes(td.textContent)) this.seed = index;
            if (['ดูด', 'Leecher', 'คนดูด'].includes(td.textContent)) this.peer = index;
        });

        Log('add column cover');

        //add column
        if(Setting.preview === true){
            $(td.get(0)).after(
                $("<td>", {
                    class : 'colhead 11',
                    align : 'center',
                    width : '125px',
                    text  : "รูป"
                }).append(this.progressBar.template)
            );
        }

        //touch first
        this.touchProgressBar();

        Log('Done');
    }

    touchProgressBar() {
        this.progressBar.run++;
        this.progressBar.template.html(` [ ${this.progressBar.run}/${this.progressBar.all}  ]`);

        Log('#', `touch progress bar ${this.progressBar.run}`);
    }
}

export default Head;