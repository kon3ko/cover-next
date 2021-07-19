import Log from "./log";

class HookDetail {
    data;
    hook = [];

    constructor( { data, hook } ) {
        this.data = data;
        this.hook = hook;

        Log('Register hook');
    }

    async detail() {
        Log('Hook detail');

        let handler = await this.frame();

        //hook
        const promises = this.hook.map(async ( { callback, self } ) => {
            return await callback({
                handler : handler,
                html    : handler.target.contentDocument,
                self    : self,
            });
        });
        await Promise.all(promises);

        return handler.target.contentDocument;
    }

    async frame( callback ) {
        return await new Promise(resolve => {
            Log('Frame creating...');

            //create frame
            let frame = $('<iframe>', {
                src   : window.location.origin + '/' + this.data.detailLink,
                style : 'display:none'
            }).on("load", ( handler ) => {
                Log('load frame success');
                //remove frame
                setTimeout(() => {
                    Log('remove frame');
                    frame.remove();
                }, 3000);

                resolve(handler);
            });

            $('body').append(frame);

            Log('Done');
        });
    }
}

export default HookDetail;