function Log( index, message ) {
    if(process.env.NODE_ENV === 'development'){
        if (message === undefined) {
            if (index.charAt(0) === index.charAt(0).toUpperCase())
                index = `#### ${index} ####`;
            console.log(`%c${index}`, 'color:#1565c0;');
        } else {
            console.log(`%c#${index} ${message}`, 'color:#388e3c;');
        }
    }
}

export default Log;