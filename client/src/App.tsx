import PageLayout from "components/layouts/PageLayout"
import Bids from "features/bids/Bids"
import Plot from "features/plot/Plot"
import MainProvider from "components/context/MainProvider"
import { ToastContainer } from "react-toastify"
import Quotes from "features/quotes/Quotes"

function App() {
	return (
		<MainProvider>
			<PageLayout>
                <Plot/>
                <Quotes/>
                <Bids/>
            <ToastContainer/>
            </PageLayout>
		</MainProvider>
	)
}

export default App
