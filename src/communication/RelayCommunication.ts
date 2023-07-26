
import WebSocket from 'ws';
import { EventEmitter } from "events";
import { ICommunication } from "./ICommunication";
import { Message } from "../Message";
import { getConfig } from '../config';
import { assert } from 'console';
import { getManager } from '../Manager';

const RELAY_MESSAGE_TYPE_AUTH = "relay.auth"

export class RelayCommunication implements ICommunication {
    private url: string = "";
    private authKey: string = "";
    private deviceId: string = "";
    private ws: WebSocket | null = null;
    private pingTimer: NodeJS.Timeout | null = null;
    private finalized: boolean = false;
    getName(): string {
        return "Relay Communication"
    }
    getDescription(): string {
        return "Communication using relay server"
    }
    async init(): Promise<boolean> {
        let config = await getConfig();
        this.url = config.relay.ServerWebsocketUrl
        this.authKey = config.relay.ServerAuthKey
        this.deviceId = config.device.DeviceId
        this.finalized = false;
        if(this.url == "" || this.authKey == "" || this.deviceId == ""){
            console.log("RelayCommunication: missing config")
            return false
        }
        this.start();
        return true
    }
    async finalize(): Promise<boolean> {
        this.pingTimer != null && clearInterval(this.pingTimer)
        this.ws && this.ws.close()
        return this.finalized = true
    }
    async sendMessage(message: Message): Promise<boolean> {
        this.ws?.send(JSON.stringify(message))
        return true
    }
    start() {
        if(this.finalized){
            return
        }
        this.ws = new WebSocket(this.url);
        this.ws.on('open', () => {
            console.log("RelayCommunication: websocket connection is established")
        })
        this.ws.on('message', (message) => {
            let messageAsString = message.toString()
            let data: Message = JSON.parse(messageAsString)
            if (data.type == RELAY_MESSAGE_TYPE_AUTH) {
                this.sendMessage(<Message>{
                    type: RELAY_MESSAGE_TYPE_AUTH,
                    data: { key: this.authKey, deviceId: this.deviceId}
                })
                return
            }
            getManager().onMessage(data)
        })
        this.ws.on('error', (error) => {
            console.log(error)
            this.ws?.close()
        })
        this.ws.on('close', () => {
            console.log("RelayCommunication: websocket connection is closed")
            this.ws = null;
            setTimeout(() => {
                this.start()
            }, 5000)
        })
        this.pingTimer != null && clearInterval(this.pingTimer)
        this.pingTimer = setInterval(() => {
            this.ws?.ping()
        }, 1000*30)
    }

}