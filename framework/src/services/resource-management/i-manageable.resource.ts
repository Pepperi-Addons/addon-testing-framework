
export abstract class IManageableResource {

    constructor(removeCallback?: () => Promise<void>) {
        this.removeCallback = removeCallback;
    }

    /**
     * A callback to call after the resource is removed.
     */
    protected removeCallback?: () => Promise<void>;

    /**
     * The name of the resource.
     */
    public abstract get name(): string;

    /**
     * Create the resource.
     */
    public abstract upsert(): Promise<unknown>;

    /**
     * Remove the resource.
     */
    protected abstract remove(): Promise<void>;

    /**
     * A wrapper for the remove method, calls the callback provided in the constructor after removal.
     */
    public async removeResource(): Promise<void> {
        try {
            await this.remove();

            if (this.removeCallback) {
                console.log('IManageableResource: calling remove callback');
                await this.removeCallback();
            }
        } catch (error) {
            console.error(`IManageableResource: failed removing resource, error: ${(error as Error).message}`);
            throw error;
        }
    }
}
