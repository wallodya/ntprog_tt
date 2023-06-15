import Decimal from "decimal.js";
import { OrderStatus, OrderSide } from "types/Enums";
import { Order } from "./Orders";

export const MOCK_BID_DATA: Order[] = [
    {
        orderId: "1-some-very-long-id-string",
        created_at: Date.now(),
        updated_at: Date.now(),
        status: OrderStatus.active,
        side: OrderSide.buy,
        price: new Decimal(8.559),
        amount: 10_000,
        instrument: "CHN/RUB",
        userId: "some-user-id"
    },
    {
        orderId: "2",
        created_at: Date.now(),
        updated_at: Date.now(),
        status: OrderStatus.cancelled,
        side: OrderSide.buy,
        price: new Decimal(12.69),
        amount: 500_000,
        instrument: "USD/RUB",
        userId: "user-1-id"
    },
    {
        orderId: "3",
        created_at: Date.now(),
        updated_at: Date.now(),
        status: OrderStatus.active,
        side: OrderSide.sell,
        price: new Decimal(23.55),
        amount: 78_000,
        instrument: "USD/EUR",
        userId: "user-1-id"
    },
    {
        orderId: "4",
        created_at: Date.now(),
        updated_at: Date.now(),
        status: OrderStatus.filled,
        side: OrderSide.buy,
        price: new Decimal(54.87),
        amount: 10_000,
        instrument: "CHN/RUB",
        userId: "some-user-id"
    },
    {
        orderId: "5",
        created_at: Date.now(),
        updated_at: Date.now(),
        status: OrderStatus.filled,
        side: OrderSide.buy,
        price: new Decimal(34.008),
        amount: 30_000,
        instrument: "CHN/RUB",
        userId: "some-user-id"
    },
    {
        orderId: "6",
        created_at: Date.now(),
        updated_at: Date.now(),
        status: OrderStatus.active,
        side: OrderSide.buy,
        price: new Decimal(2.579),
        amount: 12_000,
        instrument: "TRY/RUB",
        userId: "user-1-id"
    },
    {
        orderId: "7",
        created_at: Date.now(),
        updated_at: Date.now(),
        status: OrderStatus.rejected,
        side: OrderSide.sell,
        price: new Decimal(10),
        amount: 500,
        instrument: "BYN/RUB",
        userId: "some-user-id"
    },


]