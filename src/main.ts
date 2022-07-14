import { Customer } from "./entity/customer";
import { Address } from "./entity/address";

const customer = new Customer('123', 'John');
const address = new Address('Main Street', 123, 'New York', '12345');

customer.address = address;