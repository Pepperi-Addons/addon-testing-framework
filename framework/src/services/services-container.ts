import { Client } from "@pepperi-addons/debug-server/dist";
import { BaseService } from "./base-service";

type BaseServiceConstructor = new (_: ServicesContainer) => BaseService;

/**
 * @class ServicesContainer
 * @description
 * This class is responsible for managing the services of the framework.
 * Each service only has one instance and is initialized when it is first requested.
 * Services can be added to the container by calling the get method.
 * Services must inherit from the BaseService class in order to be added to the container.
 * There is a teardown method which will be called when the tests are finished.
 */
export class ServicesContainer {

    private services: BaseService[] = [];

    constructor(public client: Client) {

    }

    get<T extends BaseServiceConstructor>(serviceClass: T): InstanceType<T> {
        // check if the service is already initialized
        let serviceInstance: BaseService | undefined = this.services.find(s => s instanceof serviceClass);
        
        // if the service is not initialized, initialize it
        if (!serviceInstance) {
            serviceInstance = new serviceClass(this);
            this.services.push(serviceInstance);
        }

        // return the service
        return serviceInstance as InstanceType<T>;
    }

    /**
     * The @TestRunner will call this method when the tests are finished.
     * This method will call the teardown method of each service.
     * Allowing each service to clean up resources created by the service.
     */
    async teardown() {
        await Promise.allSettled(this.services.map(s => s.teardown()));
    }
}