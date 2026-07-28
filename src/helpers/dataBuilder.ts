import { faker } from '@faker-js/faker';
import { sign} from '../types/log';


export function userCreate(): sign{
    return{
        email: `${faker.internet.username()}@hotmail.com`,
        password: `Test${faker.string.alphanumeric(4)}3*`
    };
}