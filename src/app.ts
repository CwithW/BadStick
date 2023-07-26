import { getManager } from "./Manager"


class App{
    
    async run(){
        let manager = getManager();
        await manager.init();
    }

    async shutdown(){
        let manager = getManager();
        await manager.finalize();
    }

}

let app = new App();

export function getApp(){
    return app;
}

async function main(){
    await app.run();
}

main()