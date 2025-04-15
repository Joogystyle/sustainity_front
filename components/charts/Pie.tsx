"use client"

import { Pie } from "react-chartjs-2"
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js"

import { Card } from "@/components/ui/card"

ChartJS.register(ArcElement, Tooltip, Legend)

type PieChartProps = {
    labels: string[]
    counts: number[]
    columnPie: string | null
}

export default function PieChart({ labels, counts, columnPie }: PieChartProps) {
    const data = {
        labels,
        datasets: [
            {
                label: "Frequency",
                data: counts,
                backgroundColor: [
                    "#36A2EB",
                    "#FF6384",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                    "#FF9F40",
                ],
                borderWidth: 1,
            },
        ],
    }

    return (
        <Card className="p-4 max-w-lg mx-auto">
            <Pie data={data}
                options={{
                    plugins: {
                        title: {
                            display: true,
                            text: "Top 5 " + columnPie,
                            font: {
                                size: 18,
                            },
                            padding: {
                                top: 10,
                                bottom: 20,
                            },
                        },
                        legend: {
                            position: "bottom",
                        },
                    },
                }} />
        </Card>
    )
}
