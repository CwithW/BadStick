import { Message } from "../Message";
import { getConfig } from "../config";
import { IGadget } from "./IGadget";
import * as fs from 'fs';
function keyboard_fill_report(hid_code: number): Array<number> {
    let result = [0, 0, hid_code, 0, 0, 0, 0, 0]
    return result;
}

export class HidGadget implements IGadget {
    async onMessage(message: Message): Promise<boolean> {
        if (/gadget\.hid\..*/.test(message.type)) {
            switch (message.type) {
                case "gadget.hid.key_down":
                    {
                        await this.sendKeyDown(message.data)
                    }
                    break;
                case "gadget.hid.key_up":
                    {
                        await this.sendKeyUp(message.data)
                    }
                    break;
                case 'gadget.hid.key':
                    {
                        await this.sendKey(message.data)
                    }
                    break;
                default:
                    ;
            }
            return true
        }
        return false
    }
    file: fs.promises.FileHandle | undefined = undefined
    async init(): Promise<boolean> {
        let filename = await (await getConfig()).gadget.HidGadgetDeviceFile
        if (!fs.existsSync(filename)) {
            console.log(`HidGadget: failed to open hid gadget device ${filename}`)
            return false
        }
        this.file = await fs.promises.open(filename, 'w')
        return this.file !== undefined
    }
    async finalize(): Promise<boolean> {
        if (this.file !== undefined) {
            await this.file.close()
        }
        this.file = undefined
        return true
    }

    getName(): string {
        return "HID Gadget"
    }
    getDescription(): string {
        return "Implements the HID Gadget protocol"
    }

    async sendRaw(data: Buffer): Promise<boolean> {
        if (this.file === undefined) {
            return false
        }
        await this.file.write(data)
        return true
    }
    async sendKey(hid_keyCode: number) {
        let report = keyboard_fill_report(hid_keyCode)
        await this.sendRaw(Buffer.from(report))
        report = keyboard_fill_report(0)
        await this.sendRaw(Buffer.from(report))

    }
    async sendKeyDown(hid_keyCode: number) {
        let report = keyboard_fill_report(hid_keyCode)
        await this.sendRaw(Buffer.from(report))
    }

    async sendKeyUp(hid_keyCode: number) {
        //todo implement keyCode
        let report = keyboard_fill_report(0)
        await this.sendRaw(Buffer.from(report))

    }

}