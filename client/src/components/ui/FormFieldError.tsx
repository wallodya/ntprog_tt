import { FieldError } from "react-hook-form"

const FormFieldError = ({ err }: { err: FieldError | undefined }) => {
	return (
		<p
			className={`relative text-xs my-2 font-semibold text-red-600 ${
				!err && "text-transparent"
			} transition`}
		>
			{err ? `*${err.message}` : "*"}
		</p>
	)
}

export default FormFieldError
