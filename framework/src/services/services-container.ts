import { Client, Request } from "@pepperi-addons/debug-server/dist";
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

    constructor(public client: Client, public request: Request) {

    }

    /**
     * Get a service from the container to use in the tests.
     * If the service should be cached, it will be cached and returned on subsequent calls.
     * @param serviceClass the class of the service to get
     * @param localServiceClass the class of the service to get in case debug mode is on
     * @returns An instance of the service
     * @example
     * ```typescript
     * const apiService = this.container.get(AddonAPIService);
     * 
     * // for debug mode
     * const apiService = this.container.get(AddonAPIService, AddonAPIServiceDebug);
     * ```
     */
    get<T extends BaseServiceConstructor, Y extends T>(serviceClass: T, localServiceClass?: Y): InstanceType<T> {
        // if debug mode is on, use the local debug service class if it is passed in
        const classToInit = this.client.isDebug && localServiceClass ? localServiceClass : serviceClass;

        // check if the service is already initialized
        let serviceInstance: BaseService | undefined = this.services.find(s => s instanceof classToInit);
        
        // if the service is not initialized, initialize it
        if (!serviceInstance) {
            serviceInstance = new classToInit(this);
            
            // cache the service if necessary
            if (serviceInstance.shouldCache()) {
                this.services.push(serviceInstance);
            }
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