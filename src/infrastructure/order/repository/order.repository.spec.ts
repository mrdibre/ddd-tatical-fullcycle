import { Sequelize } from "sequelize-typescript";
import { CustomerRepository } from "../../customer/repository/customer-repository";
import { Customer } from "../../../domain/customer/entity/customer";
import { Address } from "../../../domain/customer/value-object/address";
import { CustomerModel } from "../../customer/model/customer.model";
import { OrderModel } from "../model/order.model";
import { OrderItemModel } from "../model/order-item.model";
import { OrderRepository } from "./order-repository";
import { ProductModel } from "../../product/model/product.model";
import { ProductRepository } from "../../product/repository/product-repository";
import { Product } from "../../../domain/product/entity/product";
import { OrderItem } from "../../../domain/checkout/entity/order-item";
import { Order } from "../../../domain/checkout/entity/order";

describe('Order Repository Test', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    });

    sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close();
  })

  it('should create a order', async () => {
    const address = new Address('123 Main St', 123, 'CA', '12345');
    const customer = new Customer('1', 'John Doe');
    customer.changeAddress(address)

    const customerRepository = new CustomerRepository();
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product('1', 'Product 1', 10);
    await productRepository.create(product);

    const orderItem = new OrderItem('1', product.name, product.price, product.id, 1);

    const order = new Order('123', customer.id, [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order)

    const orderModel = await OrderModel.findByPk(order.id, {
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: order.customerId,
      total: order.total(),
      items: [
        {
          order_id: order.id,
          id: order.items[0].id,
          name: order.items[0].name,
          price: order.items[0].price,
          quantity: order.items[0].quantity,
          product_id: order.items[0].productId,
        },
      ],
    })
  })
})
