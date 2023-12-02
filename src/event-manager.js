import { ButtonClicked } from "./events/button-clicked.js";
import { EventManagerInitialized } from "./events/event-manager-initialized.js";
import { EventManagerUpdated } from "./events/event-manager-updated.js";
import { UsernameChanged } from "./events/user-name-changed.js";
import { UserSettingsReset } from "./events/user-settings-reset.js";
import { getStateProxy } from "./reactive-properties.js";


class EventManager extends EventTarget {

    #state = {
        buttonClickedCount: 0,
        user: {
            name: undefined
        },
        alerts: []
    };

    MANAGED_EVENTS = [
        UsernameChanged,
        ButtonClicked
    ]

    constructor() {
        super();

        // this.#state = new Proxy(this.#state, getStateProxy(this));
        this.#state = getStateProxy(this.#state, this);

        this.MANAGED_EVENTS.forEach(ev => {
            // This maps all of the events to the `handleEvent` function
            this.addEventListener(ev.name, this)
        });

        // Could do some async calls and therefor initialization might not be synchronous...
        this.broadcast(new EventManagerInitialized());
    }

    /**
     * @param {string} propKey
     * @param {EventListenerOrEventListenerObject} callback
     */
    listen(propKey, callback) {
        return this.addEventListener(EventManagerUpdated.forProperty(propKey), callback);
    }


    /**
     * @param {Event} ev
     */
    handleEvent(ev) {
        if (ev instanceof UsernameChanged) {
            // Type narrowing makes it so that inside the if-block we 
            // are actually using the UsernameChanged type and not just Event
            this.#state.user.name = ev.userName

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
        }
    }

    getButtonClickCount() {
        return this.#state.buttonClickedCount;
    }

    getUserName() {
        return this.#state.user.name;
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


let instance = new EventManager();

export { instance as EventManager };
export { EventManager as EventManagerClass };
