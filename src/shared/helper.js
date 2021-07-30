//SATYAJIT

export function htmlDecode( string ) {
    const Entities = require('html-entities').AllHtmlEntities;
    const entities = new Entities();
    return entities.decode(string);
}

export function localDate( cell ){
    var date_time = cell.split(' ');
    var date = date_time[0].split('-');
    var date_format = new Date(date[0],(date[1]-1),date[2]);
    return date_format;
}

export function trimString(length,string){
    var trimmedString = '';
    if (string.length > 17) {
        trimmedString = string.substring(0, 14) + "...";
    }else{
        trimmedString = string.substring(0, length);
    }    
    return `${trimmedString}`;
}
