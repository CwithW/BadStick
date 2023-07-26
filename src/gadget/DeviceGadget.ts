import { getManager } from "../Manager";
import { Message } from "../Message";
import { getApp } from "../app";
import { IGadget } from "./IGadget";
import * as child_process from 'child_process'
import * as util from 'util'
const exec = util.promisify(child_process.exec)
export class DeviceGadget implements IGadget {
    getName(): string {
        return "Device"
    }
    getDescription(): string {
        return "Various Device Operations"
    }
    async init(): Promise<boolean> {
        return true
    }
    async finalize(): Promise<boolean> {
        return true
    }
    async onMessage(message: Message): Promise<boolean> {
        if (/gadget\.device\..*/.test(message.type)) {
            switch (message.type) {
                case 'gadget.device.shutdown': {
                    setTimeout(() => {
                        getApp().shutdown()
                    }, 1)
                }
                    break
                case 'gadget.device.execute_command': {
                    let command = message.data
                    let _ = await exec(command)
                }
                    break
                default:
                    ;

            }
            return true
        }
        return false
    }
}