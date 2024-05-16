import {customAlphabet} from "nanoid";

const nanoid = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ0123456789');

export function getId(size: number = 8) {
    return nanoid(size);
}
