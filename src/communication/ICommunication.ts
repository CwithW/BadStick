import { Message } from "../Message";

export interface ICommunication {
    getName(): string;
    getDescription(): string;
    init(): Promise<boolean>;
    finalize(): Promise<boolean>;
    sendMessage(message: Message): Promise<boolean>;
}