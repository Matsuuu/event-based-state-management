import { EventManagerClass } from "./event-manager";
import { EventManagerUpdated } from "./events/event-manager-updated";

/**
 * @param {EventManagerClass} thisInstance
    * @param {Record<string, unknown>} stateObject
 */
export function getStateProxy(stateObject, thisInstance) {
    const propPath = [];
    const mainProxy = setupProxy(stateObject, thisInstance, propPath);

    setupNestedProxy(stateObject, thisInstance, propPath);

    return mainProxy;
}

/**
 * @param {Object} targetObject
 * @param {EventManagerClass} thisInstance
 * @param {string[]} propPath
 */
function setupNestedProxy(targetObject, thisInstance, propPath) {
    [...Object.entries(targetObject)].filter(
        entry => entry[1] instanceof Object && !Array.isArray(entry[1])
    ).forEach(entry => {
        const key = entry[0];
        const value = entry[1];
        const newPropPath = [...propPath, key];
        targetObject[key] = setupProxy(value, thisInstance, newPropPath);
        setupNestedProxy(value, thisInstance, newPropPath);
    });

}

/**
 * @param {any} targetObject
 * @param {EventManagerClass} thisInstance
 * @param {string[]} propPath
 */
function setupProxy(targetObject, thisInstance, propPath) {
    return new Proxy(targetObject, {
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
            // console.log("SET ", { obj, prop, value });

            const oldValue = Reflect.get(obj, prop);
            const reflectResult = Reflect.set(obj, prop, value);

            const eventPropPaths = [...propPath, prop];
            let propKey = "";
            while (eventPropPaths.length > 0) {
                if (propKey.length > 0) {
                    propKey += ".";
                }
                propKey = propKey + eventPropPaths.shift();
                console.log("Submitting update event to  ---- ", propKey)
                thisInstance.broadcast(new EventManagerUpdated(propKey, oldValue, value));
            }

            return reflectResult
        }
    });
}
