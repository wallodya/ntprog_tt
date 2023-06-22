import { marketDataUpdateMessageSchema } from "./schemas/server-message.schema"

describe("Market update schema", () => {
	describe("with empty quotes array", () => {
		const data = {
			subscription_id: 23,
			instrument: {
				buy_position: 4480.0,
				instrument_id: 12,
				name: "BYN/RUB",
				sell_position: 8160,
			},
			quotes: [],
		}
		test("should parse valid messages correctly (with no quotes)", () => {
			const parsed = marketDataUpdateMessageSchema.safeParse(data)

			if (!parsed.success) {
				console.log(parsed.error)
			}

			expect(parsed.success).toBe(true)
		})
		test("should transfom subscription id", () => {
			const parsed = marketDataUpdateMessageSchema.safeParse(data)

			if (!parsed.success) {
				console.log(parsed.error)
			}
			expect(parsed.success).toBe(true)

			if (!parsed.success) return

			expect(parsed.data).toHaveProperty("subscriptionId")
		})

		test("should have valid instrument data", () => {
			const parsed = marketDataUpdateMessageSchema.safeParse(data)

			if (!parsed.success) {
				console.log(parsed.error)
			}
			expect(parsed.success).toBe(true)

			if (!parsed.success) return

			expect(parsed.data).toHaveProperty("instrument")
			expect(parsed.data.instrument).toHaveProperty("instrumentId")
			expect(parsed.data.instrument).toHaveProperty("name")
			expect(parsed.data.instrument).toHaveProperty("buyPosition")
			expect(parsed.data.instrument).toHaveProperty("sellPosition")
		})

		test("should have quotes array", () => {
			const parsed = marketDataUpdateMessageSchema.safeParse(data)

			if (!parsed.success) {
				console.log(parsed.error)
			}
			expect(parsed.success).toBe(true)

			if (!parsed.success) return

			expect(parsed.data).toHaveProperty("quotes")
			expect(parsed.data.quotes).toBeInstanceOf(Array)
		})
	})

	describe("with quotes data", () => {
		const data = {
			subscription_id: 23,
			instrument: {
				buy_position: 4480.0,
				instrument_id: 12,
				name: "BYN/RUB",
				sell_position: 8160,
			},
			quotes: [
				{
					bid: 22.827,
					offer: 22.827,
					bid_amount: 130230,
					offer_amount: 130230,
					timestamp: 1687171155426,
				},
				{
					bid: 22.827,
					offer: 22.827,
					bid_amount: 130230,
					offer_amount: 130230,
					timestamp: 1687171155426,
				},
				{
					bid: 22.827,
					offer: 22.827,
					bid_amount: 130230,
					offer_amount: 130230,
					timestamp: 1687171155426,
				},
				{
					bid: 22.827,
					offer: 22.827,
					bid_amount: 130230,
					offer_amount: 130230,
					timestamp: 1687171155426,
				},
			],
		}
		test("should validate correct data", () => {
			const parsed = marketDataUpdateMessageSchema.safeParse(data)

			if (!parsed.success) {
				console.log(parsed.error)
			}
			expect(parsed.success).toBe(true)
		})

		test("should transform quotes data correctly", () => {
			const parsed = marketDataUpdateMessageSchema.safeParse(data)

			if (!parsed.success) {
				console.log(parsed.error)
			}
			expect(parsed.success).toBe(true)

            if (!parsed.success) return

            expect(parsed.data.quotes).toBeInstanceOf(Array)
            expect(parsed.data.quotes.length).toBe(4)
            expect(parsed.data.quotes[0]).toHaveProperty("bid")
            expect(parsed.data.quotes[0]).toHaveProperty("bidAmount")
            expect(parsed.data.quotes[0]).toHaveProperty("offer")
            expect(parsed.data.quotes[0]).toHaveProperty("offerAmount")
            expect(parsed.data.quotes[0]).toHaveProperty("timestamp")
		})
	})
})
