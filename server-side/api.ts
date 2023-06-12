import { Client, Request } from '@pepperi-addons/debug-server'

export async function test(client: Client, request: Request) {
    return {
        Hello: 'World'
    }
};

export async function run_addon_tests(client: Client, request: Request) {
    if (request.method !== 'POST') {
        throw new Error('Only POST requests are allowed')
    }

    // the addon UUID is in the request body
    const addonUUID = request.body.AddonUUID

    // get the addons tests
    

}

