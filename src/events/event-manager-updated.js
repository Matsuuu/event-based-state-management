export class EventManagerUpdated extends Event {
    /**
     * @param {string} key
     * @param {unknown} oldValue
     * @param {unknown} newValue
     */
    constructor(key, oldValue, newValue) {
        super(EventManagerUpdated.name + "-" + key);

        this.key = key;
        this.oldValue = oldValue;
        this.newValue = newValue;
    }

    /**
     * @param {string} propertyName
     */
    static forProperty(propertyName) {
        return EventManagerUpdated.name + "-" + propertyName;
    }
}
