import { Order } from "../../../domain/checkout/entity/order";
import { OrderModel } from "../model/order.model";
import { OrderItemModel } from "../model/order-item.model";

export class OrderRepository {
  async create(entity: Order): Promise<void> {
    await OrderModel.create({
      id: entity.id,
      customer_id: entity.customerId,
      total: entity.total(),
      items: entity.items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        product_id: item.productId,
      }))
    }, {
      include: [
        { model: OrderItemModel, as: "items" }
      ]
    })
  }
}
