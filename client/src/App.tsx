import PageLayout from "components/layouts/PageLayout"
import Bids from "features/bids/Bids"
import Plot from "features/plot/Plot"
import MainProvider from "components/context/MainProvider"

function App() {
	return (
		<MainProvider>
			<PageLayout>
                <Plot/>
                <Bids/>
            </PageLayout>
		</MainProvider>
	)
}

export default App
