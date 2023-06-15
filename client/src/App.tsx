import PageLayout from "components/layouts/PageLayout"
import Orders from "features/orders/Orders"
import MainProvider from "components/context/MainProvider"
import { ToastContainer } from "react-toastify"
import Quotes from "features/quotes/Quotes"

function App() {
	return (
		<MainProvider>
			<PageLayout>
                <Quotes/>
                <Orders/>
            <ToastContainer/>
            </PageLayout>
		</MainProvider>
	)
}

export default App
