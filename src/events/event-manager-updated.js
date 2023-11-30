export class EventManagerUpdated extends Event {
    /**
     * @param {Record<string, unknown>} updatedProperties
     */
    constructor(updatedProperties) {
        super(EventManagerUpdated.name);
        this.updatedProperties = updatedProperties;
    }
}
