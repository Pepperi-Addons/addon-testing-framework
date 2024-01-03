import { ServicesContainer } from "./services-container";
import { Helper } from "@pepperi-addons/papi-sdk"

const helper = new Helper();

/**
 * @class BaseService
 * @description
 * This class is the base class for all services.
 * Services are used to provide functionality to the tests.
 * Services can be added to the ServicesContainer and then retrieved by the test.
 * Services must inherit from this class in order to be added to the container.
 * Services can implement a teardown method which will be called when the tests are finished.
 */
export abstract class BaseService {

    /**
     * @constructor
     * @param container - The services container. Added so that the service can access other services.
     */
    constructor(protected container: ServicesContainer) {
        this.container.request.header = helper.normalizeHeaders(this.container.request.header);
    }

    /**
     * The @TestRunner will call this method when the tests are finished.
     * This method can overriden to clean up resources created by the service.
     */
    async teardown() {

    }

    /**
     * This method is call by the @ServicesContainer to determine if the service should be cached.
     * Services that hold data than needs to be cleaned up should be cached.
     * Additionally, services that are expensive to initialize should be cached.
     * @returns Whether or not the service should be cached.
     */
    shouldCache() {
        return false;
    }
}