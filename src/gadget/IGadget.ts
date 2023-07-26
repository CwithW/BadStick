import { Message } from "../Message";


/**
 * Interface for a base gadget operator.
 */
export interface IGadget {
    /**
     * Gets the name of the gadget operator.
     * @returns The name of the gadget operator.
     */
    getName(): string;

    /**
     * Gets the description of the gadget operator.
     * @returns The description of the gadget operator.
     */
    getDescription(): string;

    /**
     * Initializes the gadget operator.
     * @returns A promise that resolves to true if initialization was successful, or false otherwise.
     */
    init(): Promise<boolean>;

    /**
     * Finalizes the gadget operator.
     * @returns A promise that resolves to true if finalization was successful, or false otherwise.
     */
    finalize(): Promise<boolean>;

    /**
     * triggers on message from Communications
     * @param message The message to handle.
     * @returns return true to stop message propagation
        */
    onMessage(message: Message): Promise<boolean>;

}