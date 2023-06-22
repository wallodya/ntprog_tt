import PageLayout from "components/layouts/PageLayout"
import Orders from "features/orders/Orders"
import MainProvider from "components/context/MainProvider"
import { ToastContainer } from "react-toastify"
import Quotes from "features/subscriptions/Tickers"
import "react-toastify/dist/ReactToastify.css"

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
