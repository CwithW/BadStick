import { Message } from "./Message";

export interface IManager{
    init(): Promise<boolean>;
    finalize(): Promise<boolean>;
    onMessage(message:Message): Promise<void>;
    onClientToServerMessage(message:Message): Promise<void>;
}