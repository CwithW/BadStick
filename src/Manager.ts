import { IManager } from "./IManager"
import { Message } from "./Message"
import { ICommunication } from "./communication/ICommunication"
import { RelayCommunication } from "./communication/RelayCommunication"
import { ServerCommunication } from "./communication/ServerCommunication"
import { DeviceGadget } from "./gadget/DeviceGadget"
import { HidGadget } from "./gadget/HidGadget"
import { IGadget } from "./gadget/IGadget"
import { ScriptGadget } from "./gadget/ScriptGadget"

type CommunicationInfo = {
    communication: ICommunication,
    status: "init" | "running" | "finalized" | "error",
}
type GadgetInfo = {
    gadget: IGadget,
    status: "init" | "running" | "finalized" | "error"
}

const COMMUNICATIONS = [RelayCommunication,ServerCommunication]

// ScriptOperator comes first
const GADGETS = [ScriptGadget, DeviceGadget, HidGadget]


let manager: IManager | undefined = undefined

export function getManager(): IManager {
    if (manager === undefined) {
        manager = new Manager()
    }
    return manager
}

export class Manager implements IManager {
    private running: boolean = true;
    private communications: CommunicationInfo[] = []
    private gadgets: GadgetInfo[] = []

    async onMessage(message: Message): Promise<void> {
        if (!this.running) { return }
        for (let info of this.gadgets) {
            if (info.status == "running") {
                if (await info.gadget.onMessage(message)) {
                    return
                }
            }
        }
        console.log(`Manager: no gadget can handle message ${message.type}`)
    }

    async onClientToServerMessage(message: Message): Promise<void> {
        if (!this.running) { return }
        for (let info of this.communications) {
            if (info.status == "running") {
                await info.communication.sendMessage(message)
            }
        }
    }

    public async init() {
        this.running = true;
        // initGadgets comes first
        await this.initGadgets()
        await this.initCommunications()
        return true
    }

    public async finalize() {
        this.running = false;
        await this.finalizeCommunications()
        // finalizeGadgets comes last
        await this.finalizeGadgets()
        return true
    }

    private async initCommunications() {
        for (let clazz of COMMUNICATIONS) {
            let instance = new clazz()
            let info: CommunicationInfo = {
                communication: instance,
                status: "init"
            }
            try {
                let result = await instance.init()
                if (!result) {
                    throw new Error(`Communication ${instance.getName()} does not init`)
                }
                info.status = "running"
                console.log(`Manager: inited communication ${instance.getName()}`)
            } catch (e) {
                console.error(e)
                info.status = "error"
            }
            this.communications.push(info)
        }
    }

    private async initGadgets() {
        for (let clazz of GADGETS) {
            let instance = new clazz()
            let info: GadgetInfo = {
                gadget: instance,
                status: "init"
            }
            try {
                let result = await instance.init()
                if (!result) {
                    throw new Error(`Gadget ${instance.getName()} does not init`)
                }
                info.status = "running"
                console.log(`Manager: inited gadget ${instance.getName()}`)
            } catch (e) {
                console.error(e)
                info.status = "error"
            }
            this.gadgets.push(info)
        }
    }

    private async finalizeCommunications() {
        for (let info of this.communications) {
            if (info.status == "running") {
                try {
                    let result = await info.communication.finalize()
                    if (!result) {
                        throw new Error(`Communication ${info.communication.getName()} does not finalize`)
                    }
                    info.status = "finalized"
                    console.log(`Manager: finalized communication ${info.communication.getName()}`)
                } catch (e) {
                    console.error(e)
                    info.status = "error"
                }
            }
        }
    }

    private async finalizeGadgets() {
        for (let info of this.gadgets) {
            if (info.status == "running") {
                try {
                    let result = await info.gadget.finalize()
                    if (!result) {
                        throw new Error(`Gadget ${info.gadget.getName()} does not finalize`)
                    }
                    info.status = "finalized"
                    console.log(`Manager: finalized gadget ${info.gadget.getName()}`)
                } catch (e) {
                    console.error(e)
                    info.status = "error"
                }
            }
        }
    }
}