import { html, render } from "lit";
import { EventManager } from "../event-manager.js";
import { UsernameChanged } from "../events/user-name-changed.js";
import { EventManagerUpdated } from "../events/event-manager-updated";
import { ButtonClicked } from "../events/button-clicked.js";

export function HomeView() {
    /**
     * @param {SubmitEvent} ev
     */
    function onFormSubmit(ev) {
        ev.preventDefault();
        const form = /** @type { HTMLFormElement } */ (ev.target);
        const formData = new FormData(form);

        const userName = formData.get("user-name");
        if (!userName) {
            return;
        }

        // This would be `EventManager` when called from outside of this file.
        EventManager.dispatchEvent(new UsernameChanged(userName.toString()));
    }

    /**
     * @param {SubmitEvent} ev
     */
    function onPhoneFormSubmit(ev) {
        ev.preventDefault();
        const form = /** @type { HTMLFormElement } */ (ev.target);
        const formData = new FormData(form);

        const phone = formData.get("phone-number");
        if (!phone) {
            return;
        }

        // This would be `EventManager` when called from outside of this file.
        // EventManager.dispatchEvent(new UsernameChanged(userName.toString()));
    }

    function onButtonClick() {
        EventManager.dispatchEvent(new ButtonClicked());
    }

    const view = () => html`
        <h2>Home ${EventManager.getUserName()}!</h2>

        <p>You've clicked this button ${EventManager.getButtonClickCount()} times</p>
        <button @click=${onButtonClick}>Click</button>

        <form @submit=${onFormSubmit}>
            <input placeholder="Username" type="text" name="user-name" />

            <input type="submit" />
            <input type="reset" />
        </form>

        <form @submit=${onPhoneFormSubmit}>
            <input placeholder="Phone" type="text" name="phone-number" />

            <input type="submit" />
            <input type="reset" />
        </form>
    `;

    EventManager.addEventListener(EventManagerUpdated.forProperty("buttonClickedCount"), (ev) => {
        console.log("buttonClickedCount updated!");
        render(view(), document.body);
    });

    EventManager.listen("buttonClickedCount", (ev) => {
        render(view(), document.body);
    });

    EventManager.listen("user.name", (ev) => {
        console.log("User.name updated!");
    });

    EventManager.listen("user", (ev) => {
        console.log("User updated!");
    });

    return view();
}
