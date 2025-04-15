'use client';

import { useState, useMemo, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { useSearchParams } from "next/navigation";
import PieChart from '@/components/charts/Pie';


type SortOrder = "asc" | "desc";
type Row = Record<string, any>;

function getTopFrequencyData(rows: Row[], column: string) {
    const frequencyMap: Record<string, number> = {};

    rows.forEach((row) => {
        const value = String(row[column]).trim();
        if (value) {
            frequencyMap[value] = (frequencyMap[value] || 0) + 1;
        }
    });

    const sortedEntries = Object.entries(frequencyMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5); // Keep only top 5

    const labels = sortedEntries.map(([label]) => label);
    const counts = sortedEntries.map(([, count]) => count);

    return { labels, counts };
}

function filterAndSort<T extends Record<string, any>>(
    data: T[],
    propsToKeep: (keyof T)[],
    sortBy: keyof T,
    sortOrder: SortOrder = "asc"
): Partial<T>[] {
    return data
        .map((item) => {
            const reduced: Partial<T> = {};
            propsToKeep.forEach((key) => {
                if (key in item) {
                    reduced[key] = item[key];
                }
            });
            return reduced;
        })
        .sort((a, b) => {
            const aVal = a[sortBy];
            const bVal = b[sortBy];

            if (aVal === undefined || bVal === undefined) return 0;

            if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
            if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });
}



export default function VisualizeWrapper() {
    const [headers, setHeaders] = useState<string[]>([]);
    const [rows, setRows] = useState<any[]>([]);

    useEffect(() => {
        // Retrieve headers and rows from localStorage
        const storedHeaders = localStorage.getItem('headers');
        const storedRows = localStorage.getItem('rows');

        if (storedHeaders && storedRows) {
            setHeaders(JSON.parse(storedHeaders));
            setRows(JSON.parse(storedRows));
        }
    }, []);

    return <VisualizePage headers={headers} rows={rows} />;
}

export function VisualizePage({
    headers,
    rows,
}: {
    headers: string[];
    rows: Record<string, any>[];
}) {

    const searchParams = useSearchParams();
    // get data from URL
    const filters = searchParams.getAll("filter");
    const sortBy = searchParams.get("sortBy");
    const sortOrder = searchParams.get("sortOrder");
    const columnPie = searchParams.get("columnPie");
    console.log(filters, sortBy, sortOrder, columnPie);

    //get frequency data for pie chart and rows that are filtered and sorted
    const finalRows = filterAndSort(rows, filters, sortBy as keyof typeof rows[0], sortOrder as SortOrder);
    const { labels, counts } = getTopFrequencyData(rows, columnPie as string);
    if (rows.length > 500) {
        rows = rows.slice(0, 500); // Limit to 500 rows for performance
    }

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar headers={headers} rows={rows} />

            {/* Main content */}
            <main className="flex-1 p-6 overflow-auto">
                <h1 className="text-4xl font-bold mb-10 mt-4">📊 Visualize Page</h1>

                {filters.length > 0 && (
                    <>
                        {/* table */}
                        <div className='grid grid-cols-3 gap-2'>
                            <div className='h-96 overflow-x-auto'>
                                <h1 className='flex items-center justify-center text-2xl font-bold mb-5'>Filter Table</h1>
                                <table className="w-full border border-gray-300 rounded-md overflow-hidden text-sm">
                                    <thead className="bg-gray-200">
                                        <tr>
                                            {filters.map((h) => (
                                                <th key={h} className="px-2 py-2 border">
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((row, i) => (
                                            <tr key={i} className="odd:bg-white even:bg-gray-50">
                                                {filters.map((h) => (
                                                    <td key={h} className="px-2 py-1 border">
                                                        {row[h]}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Chart */}
                            <div className='col-span-2'>
                                <h1 className='flex items-center justify-center text-2xl font-bold mb-5'>Pie Chart ({columnPie})</h1>
                                <PieChart labels={labels} counts={counts} columnPie={columnPie}></PieChart>
                            </div>
                        </div>

                    </>
                )}


            </main>
        </div>
    );
}
