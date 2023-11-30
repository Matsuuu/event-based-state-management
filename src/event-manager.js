import { ButtonClicked } from "./events/button-clicked.js";
import { EventManagerInitialized } from "./events/event-manager-initialized.js";
import { EventManagerUpdated } from "./events/event-manager-updated.js";
import { UsernameChanged } from "./events/user-name-changed.js";
import { UserSettingsReset } from "./events/user-settings-reset.js";

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
            this.addEventListener(ev.name, this)
        });

        // Could do some async calls and therefor initialization might not be synchronous...
        this.broadcast(new EventManagerInitialized());
    }

    /**
     * @param {Event} ev
     */
    handleEvent(ev) {
        console.log("Managing event ", ev)
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
