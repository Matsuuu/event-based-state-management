export class UsernameChanged extends Event {

    /**
     * @param {string} userName
     */
    constructor(userName) {
        super(UsernameChanged.name);
        /** @type { string} */
        this.userName = userName;
    }

    isUserNameCleared() {
        return this.userName.length === 0;
    }
}

