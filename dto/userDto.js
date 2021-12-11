
export class UserDto {
    constructor(user) {
        this.id = user._id;
        this.isActivated = user.isActivated;
    }
}