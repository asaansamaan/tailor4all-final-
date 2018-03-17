import { Item } from "./item";

export interface Cart {
    _id?: string;
    userUid?: string;
    items?: Item[];
}