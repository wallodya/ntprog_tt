const IDCell = ({id}: {id: string}) => {
    return (
		<div className="relative z-20 w-full max-w-[4rem] truncate hover:overflow-visible">
			<span className="rounded p-1 bg-neutral-100  hover:bg-neutral-200 transition-all">
				{id}
			</span>
		</div>
	)
}

export default IDCell