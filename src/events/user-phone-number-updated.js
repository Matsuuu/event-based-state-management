export class UserPhoneNumberUpdated extends Event {

    /**
     * @param {string} phone
     */
    constructor(phone) {
        super(UserPhoneNumberUpdated.name);
        /** @type { string} */
        this.phone = phone;
    }
}

