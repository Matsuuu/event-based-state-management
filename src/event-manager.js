import { ButtonClicked } from "./events/button-clicked.js";
import { EventManagerInitialized } from "./events/event-manager-initialized.js";
import { EventManagerUpdated } from "./events/event-manager-updated.js";
import { UsernameChanged } from "./events/user-name-changed.js";
import { UserPhoneNumberUpdated } from "./events/user-phone-number-updated.js";
import { UserSettingsReset } from "./events/user-settings-reset.js";
import { getStateProxy } from "./reactive-properties.js";


class EventManager extends EventTarget {

    #state = {
        buttonClickedCount: 0,
        user: {
            name: undefined,
            contact: {
                phone: undefined
            }
        },
        alerts: []
    };

    MANAGED_EVENTS = [
        UsernameChanged,
        ButtonClicked,
        UserPhoneNumberUpdated
    ]

    constructor() {
        super();

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
            this.#state.user.name = ev.userName

            if (ev.isUserNameCleared()) {
                this.broadcast(new UserSettingsReset());
            }
            return;
        }

        if (ev instanceof ButtonClicked) {
            this.#state.buttonClickedCount += 1;
        }

        if (ev instanceof UserPhoneNumberUpdated) {
            this.#state.user.contact.phone = ev.phone;
        }
    }

    /**
     * Broadcast an event to everyone listening to said event 
     * in the EventManager instance.
     * @param {Event} ev
     */
    broadcast(ev) {
        this.dispatchEvent(ev);
    }

    getButtonClickCount() {
        return this.#state.buttonClickedCount;
    }

    getUserName() {
        return this.#state.user.name;
    }
}


let instance = new EventManager();

export { instance as EventManager };
export { EventManager as EventManagerClass };
