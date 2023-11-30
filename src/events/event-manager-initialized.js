export class EventManagerInitialized extends Event {
    constructor() {
        super(EventManagerInitialized.name);
        this.initializedAt = Date.now();
    }
}

