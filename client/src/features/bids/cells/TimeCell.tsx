import moment from "moment"

const TimeCell = ({ timestamp }: { timestamp: number }) => {
	const date = moment(timestamp).format("MMM, D YYYY")
	const time = moment(timestamp).format("H:mm:ss")
	const timeMs = moment(timestamp).format("SSS")
	return (
		<div className="relative w-full flex flex-col items-center text-sm z-10">
			<div className="">{date}</div>
			<div className="">
				{time}
				<span className="text-neutral-900/50">.{timeMs}</span>
			</div>
		</div>
	)
}
export default TimeCell
