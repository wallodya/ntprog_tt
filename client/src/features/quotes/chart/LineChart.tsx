import { Chart } from 'chart.js/auto'
import { Quote } from 'models/Base'
import moment from 'moment'
import { useEffect } from 'react'

const LineChart = ({quotes}:{quotes: Quote[]}) => {

    useEffect(() => {
        const container = document.getElementById("quotes-chart-container") as HTMLCanvasElement | null

        if (!container) {
            return
        }

        const labels = quotes.map(q => moment(q.timestamp).format("YYYY-MM-DD H:mm:ss"))
        const bidData = quotes.map(q => q.bid.toNumber())
        const offerData = quotes.map(q => q.offer.toNumber())

        const chart = new Chart(container, {
            type: "line",
            data: {
                labels,
                datasets: [
                    {
                        label: "Bid price",
                        data: bidData,
                        borderColor: "rgb(220, 38, 38)"
                    },
                    {
                        label: "Offer price",
                        data: offerData,
                        borderColor: "rgb(22, 163, 74)"
                    },
                ]
            }
        })
        return () => chart.destroy()
    })

    return (
        <canvas id="quotes-chart-container"/>
    )
}

export default LineChart