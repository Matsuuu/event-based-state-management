
// Util methods

/**
 * Makes PascalCase into kebab-case
 * @param {Object} clazz 
 */
function getEventName(clazz) {
    return clazz.name.replace(/([a-z0–9])([A-Z])/g, "$1-$2").toLowerCase();
}

// --- Events --  These of course would be in a separate file.
// By having the events in classes, we can store any information and even
// functions inside of your events.

class EventManagerInitialized extends Event {
    constructor() {
        super(getEventName(EventManagerInitialized));
        this.initializedAt = Date.now();
    }
}

class EventManagerUpdated extends Event {
    /**
     * @param {Record<string, unknown>} updatedProperties
     */
    constructor(updatedProperties) {
        super(getEventName(EventManagerUpdated));
        this.updatedProperties = updatedProperties;
    }
}

class UsernameChanged extends Event {
    constructor(userName) {
        super(getEventName(UsernameChanged));
        /** @type { string} */
        this.userName = userName;
    }

    isUserNameCleared() {
        return this.userName.length === 0;
    }
}

class UserSettingsReset extends Event {
    constructor() {
        super(getEventName(UserSettingsReset));
    }
}

class ButtonClicked extends Event {
    constructor() {
        super(getEventName(ButtonClicked));
    }
}

// --- Events End

class EventManager extends EventTarget {

    #state = {
        userName: undefined,
        buttonClickedCount: 0
    };

    MANAGED_EVENTS = [
        UsernameChanged,
        ButtonClicked
    ]

    constructor() {
        super();

        this.MANAGED_EVENTS.forEach(ev => {
            // This maps all of the events to the `handleEvent` function
            this.addEventListener(getEventName(ev), this)
        });

        // Could do some async calls and therefor initialization might not be synchronous...
        this.broadcast(new EventManagerInitialized());
    }

    /**
     * @param {Event} ev
     */
    handleEvent(ev) {
        if (ev instanceof UsernameChanged) {
            // Type narrowing makes it so that inside the if-block we 
            // are actually using the UsernameChanged type and not just Event
            this.#state.userName = ev.userName
            this.broadcast(new EventManagerUpdated({ userName: ev.userName }));

            // We can call anything inside of that class with type safety as 
            // we've done the narrowing through instanceof. This also is runtime and 
            // not just compile time
            if (ev.isUserNameCleared()) {
                this.broadcast(new UserSettingsReset());
            }
            return;
        }

        if (ev instanceof ButtonClicked) {
            this.#state.buttonClickedCount += 1;
            this.broadcast(new EventManagerUpdated({ buttonClickedCount: this.#state.buttonClickedCount }));
        }
    }

    getButtonClickCount() {
        return this.#state.buttonClickedCount;
    }

    getUserName() {
        return this.#state.userName;
    }

    /**
     * Broadcast an event to everyone listening to said event 
     * in the EventManager instance.
     * @param {Event} ev
     */
    broadcast(ev) {
        this.dispatchEvent(ev);
    }
}


const instance = new EventManager();

export { instance as EventManager };


// Example of updating the global username from another view.

function onFormSubmit(ev) {
    const form = ev.target;
    const formData = new FormData(form);

    const userName = formData.get("user-name");
    if (!userName) {
        showError();
        return;
    }

    // This would be `EventManager` when called from outside of this file.
    instance.dispatchEvent(new UsernameChanged(userName));
}

function showError() {
    // Stub
}
