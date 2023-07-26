# BadStick
Use generic arm linux device, such as an Snapdragon 410 UFI stick, as an BadUsb device


## Usage

1. Install an Ubuntu or Debian on your device, you could use [OpenStick](https://github.com/OpenStick/OpenStick)

2. Connect your device to an WiFi network or configure it as an Wifi Hotspot

3. Download NodeJS `https://nodejs.org/dist/v18.15.0/node-v18.15.0-linux-arm64.tar.xz`

4. Download from release page and extract, upload everything and the NodeJS tar.xz to your device

5. SSH into your device and do `sh install.sh`
   
6. After the installation is done, reboot your device. Access the web interface on port 80
   
## Relay server

It is possible to use an relay server so you can access your device from 4G network. The [relay server](https://github.com/CwithW/BadStick_Server) is WIP.

## Scripting

It is possible to setup scripts in the `config.json` file. Scripts can be used to setup usb gadgetfs or enable 4G modem.