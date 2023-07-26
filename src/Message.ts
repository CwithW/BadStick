

export type Message = {
    type: string
    data: any
}

export type MessageWithDeviceId = Message & {
    DeviceId: string
}