import {faker} from "@faker-js/faker";

export const getRandomInt = (options?: {min: number, max: number}) => options ? faker.number.int(options) : faker.number.int()