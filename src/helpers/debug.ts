import {styleText} from 'node:util'
export function debugLog(level: string, message: string) {
    if(process.env.DEBUG === "TRUE") { 
        console.log(styleText('yellow', `[DEBUG] [${level}] ${message}`));
    }
    return;
}
