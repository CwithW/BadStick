
import * as fs from 'fs';
import * as path from 'path';

let config: Config | null = null;

export type GadgetConfig = {
    HidGadgetDeviceFile: string
}

export type RelayConfig = {
    ServerWebsocketUrl: string
    ServerAuthKey: string
}

export type ScriptConfig = {
    ScriptName: string
    ScriptContent: string
    ScriptRunOn: "boot" | "shutdown"
}

export type DeviceConfig = {
    DeviceId: string
    scripts: ScriptConfig[]
}

export type Config = {
    gadget: GadgetConfig
    relay: RelayConfig
    device: DeviceConfig
}

export async function getConfig(): Promise<Config> {
    if (config === null) {
        config = JSON.parse(await fs.promises.readFile(path.join(__dirname, 'config.json'), 'utf8'))
    }
    if (config === null) {
        throw new Error("Failed to load config.json");
    }
    return config;
}

export function flushConfig():void{
    config = null;
}