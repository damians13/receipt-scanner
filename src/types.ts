export type LineItem = {
	description: string
	text: string
	total: number
	type: string
}

export type DataRow = {
	description: string
	total: number
	active: boolean
	paidShares: Shares
	owedShares: Shares
}

export type Shares = {
	damian: number
	finn: number
	isaac: number
	will: number
	wyatt: number
}

export type Roommate = "damian" | "finn" | "isaac" | "will" | "wyatt"
