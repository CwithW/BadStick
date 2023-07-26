import { Message, MessageWithDeviceId } from "../Message";
import { ICommunication } from "./ICommunication";
import expressWs from 'express-ws';
import WebSocket from "ws";
import { default as express } from 'express';
import { getManager } from "../Manager";
import * as http from 'http';
import { getConfig } from "../config";

export class ServerCommunication implements ICommunication {
    private app = expressWs(express()).app;
    private server: http.Server | undefined = undefined;
    private clients: WebSocket[] = []
    constructor() {
        this.app.use(express.static('public'));
        this.app.get("/api", function (req, res) {
            res.json({ "hello": "stick" })
        })
        this.app.get("/api/info", async function (req, res) {
            res.json({
                code: 200,
                data: { "mode": "standalone", "DeviceId": (await getConfig()).device.DeviceId }
            });
        })

        this.app.ws('/api/ws', (ws, req) => {
            this.clients.push(ws)
            ws.on('error', function error(err) {
                console.error(err);
                ws.close();
            });
            ws.on("close", () => {
                this.clients.splice(this.clients.indexOf(ws), 1)
            })
            ws.on('message', async function message(message) {
                let data: MessageWithDeviceId = JSON.parse(message.toString())
                // todo check device id
                let data1 = data as Message
                getManager().onMessage(data1)
            });
        })
    }
    getName(): string {
        return "Server communication"
    }
    getDescription(): string {
        return "Standalone websocket + frontend server communication"
    }
    init(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {
                this.server = this.app.listen(80, function () {
                    console.log('ServerCommunication: listening on port 80');
                    resolve(true)
                });
            } catch (e) {
                reject(e)
            }
        })
    }
    finalize(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (this.server) {
                this.server.close((err) => {
                    err ? reject(err) : resolve(true)
                })
            }
        });

    }
    async sendMessage(message: Message): Promise<boolean> {
        try {
            this.clients.forEach((client) => {
                client.send(JSON.stringify(message))
            })
        } catch (e) {
            //pass
        }
        return true
    }

}
