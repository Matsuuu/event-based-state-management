import { EventManagerClass } from "./event-manager";
import { EventManagerUpdated } from "./events/event-manager-updated";

/**
 * @param {EventManagerClass} thisInstance
    * @param {Record<string, unknown>} stateObject
 */
export function getStateProxy(stateObject, thisInstance) {
    const mainProxy = new Proxy(stateObject, {
        /**
         * @param {any} target
         * @param {any} prop
         * @param {unknown} receiver
         */
        get(target, prop, receiver) {
            // console.log("GET", { target, prop, receiver });
            return Reflect.get(target, prop, receiver);
        },

        /**
         * @param {any} obj
         * @param {string} prop
         * @param {unknown} value
         */
        set(obj, prop, value) {
            console.log("SET ", { obj, prop, value });
            const oldValue = Reflect.get(obj, prop);
            const reflectResult = Reflect.set(obj, prop, value);
            thisInstance.broadcast(new EventManagerUpdated(prop, oldValue, value));
            return reflectResult
        }
    });

    let path = "";
    for (const entry of Object.entries(stateObject)) {
        console.log(entry);
        const value = entry[1];
        if (!(value instanceof Object) || Array.isArray(value)) {
            continue;
        }

        console.log("Object");
    }

    return mainProxy;
}
