import { html, render } from "lit";
import { EventManager } from "../event-manager.js";
import { UsernameChanged } from "../events/user-name-changed.js";
import { EventManagerUpdated } from "../events/event-manager-updated";

export function HomeView() {

    let user = "World";

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

    const view = () => html`
        <h2>Home ${user}!</h2>

        <form @submit=${onFormSubmit}>
            <input type="text" name="user-name" />

            <input type="submit" />
            <input type="reset" />
        </form>
    `;

    EventManager.addEventListener(EventManagerUpdated.name, (ev) => {
        user = EventManager.getUserName();
        // Re-render
        render(view(), document.body);
    });

    return view();
}
