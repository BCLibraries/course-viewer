import {UserType} from "../Types/UserType";

export default interface SetUserCallbackInterface {
    (user: UserType | null): void
};