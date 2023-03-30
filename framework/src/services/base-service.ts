import { ServicesContainer } from "./services-container";

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
        
    }

    /**
     * The @TestRunner will call this method when the tests are finished.
     * This method can overriden to clean up resources created by the service.
     */
    async teardown() {

    }
}