
const DownloadOrders = () => {

    const url = process.env["REACT_APP_SERVER_URL"]

	return (
		<a
			href={`${url}/orders/download`}
            download
			className="px-4 py-2 rounded-lg text-sma font-semibold transition border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-neutral-100"
		>
			Download
		</a>
	)
}

export default DownloadOrders
