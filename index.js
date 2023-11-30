/**
 * This is an example of utilizing the Event and EventTarget API's to create
 * custom state management -style handling for your project's events/state.
 * 
 * These API's are cross-platform, meaning that you can run this code in either 
 * Browsers or even NodeJS and it will work. This makes it extremely portable
 * and you can build on top of this system with a lot of different patterns.
 */

import { render } from "lit";
import { EventManager } from "./src/event-manager.js";
import { UsernameChanged } from "./src/events/user-name-changed.js";
import { HomeView } from "./src/views/home-view.js";

// Util methods


// --- Events --  These of course would be in a separate file.
// By having the events in classes, we can store any information and even
// functions inside of your events.


// --- Events End



// Example of updating the global username from another view.


function showError() {
    // Stub
}

render(HomeView(), document.body);
