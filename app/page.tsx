'use client';

import { useState } from "react";
import { UploadCSV } from "@/components/UploadCSV";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

export default function Home() {
    const [headers, setHeaders] = useState<string[]>([]);
    const [rows, setRows] = useState<any[]>([]);
    const router = useRouter();
    
    const length = rows.length;
    const previewRows = Math.floor(0.1 * length);
    return (
        <>
        <main className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">📊 Sustainity Dashboard</h1>

            <UploadCSV onDataParsed={(headers, rows) => {
                setHeaders(headers);
                setRows(rows);
                console.log(headers);
                console.log(rows)
            }} />

            {rows.length > 0 && (<>
                <div className="mt-6 h-80 overflow-x-auto">
                    <table className="min-w-full border text-sm">
                        <thead>
                            <tr>
                                {headers.map((header) => (
                                    <th key={header} className="border px-2 py-1 text-left bg-gray-100">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.slice(0, previewRows).map((row, idx) => (
                                <tr key={idx}>
                                    {headers.map((header) => (
                                        <td key={header} className="border px-2 py-1">
                                            {row[header]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p className="text-sm mt-2 text-muted-foreground">Showing first 10 rows</p>
                </div>
            </>
            )}
        </main>
        {rows.length > 0 &&(
            <div className="flex items-center justify-center mt-2">
                <Button size={'long'}  onClick={() => router.push('/visualize')}>visualize</Button>
            </div>
        )}
        </>
    );
}
