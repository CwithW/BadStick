import { Message } from "../Message";
import { getConfig } from "../config";
import { IGadget } from "./IGadget";
import * as child_process from 'child_process';
import * as util from 'util';

const exec = util.promisify(child_process.exec);

export class ScriptGadget implements IGadget{
    async onMessage(message: Message): Promise<boolean> {
        return false
    }
    getName(): string {
        return "Script Runner"
    }
    getDescription(): string {
        return "run scripts"
    }
    async init(): Promise<boolean> {
        let scripts = (await getConfig()).device.scripts
        scripts = scripts.filter((script)=>{script.ScriptRunOn.toLowerCase() == "boot"})
        for(let script of scripts){
            try{
                // users may want to wait for script to finish
                await exec(script.ScriptContent)
            }catch(e){
                console.log(`ScriptGadget: failed to run script ${script.ScriptName}`)
            }
        }
        console.log(`ScriptGadget: ran ${scripts.length} scripts on boot`)
        return true

    }
    async finalize(): Promise<boolean> {
        let scripts = (await getConfig()).device.scripts
        scripts = scripts.filter((script)=>{script.ScriptRunOn.toLowerCase() == "shutdown"})
        for(let script of scripts){
            try{
                await exec(script.ScriptContent)
            }catch(e){
                console.log(`ScriptGadget: failed to run script ${script.ScriptName}`)
            }
        }
        console.log(`ScriptGadget: ran ${scripts.length} scripts on shutdown`)
        return true
    }

}