import PageLayout from "components/layouts/PageLayout"
import Bids from "features/bids/Bids"
import Plot from "features/plot/Plot"
import AuthProvider from "features/auth/AuthProvider"

function App() {
	return (
		<AuthProvider>
			<PageLayout>
                <Plot/>
                <Bids/>
            </PageLayout>
		</AuthProvider>
	)
}

export default App
