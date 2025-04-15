'use client';

import { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Papa from 'papaparse';

interface UploadCSVProps {
    onDataParsed: (headers: string[], data: any[]) => void;
}

export function UploadCSV({ onDataParsed }: UploadCSVProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const parsedData = results.data as Record<string, any>[];
                if (parsedData.length > 0) {
                    const headers = Object.keys(parsedData[0]);
                    // Save headers and rows to localStorage
                    localStorage.setItem('headers', JSON.stringify(headers));
                    localStorage.setItem('rows', JSON.stringify(parsedData));
                    onDataParsed(headers, parsedData);
                }
            },
        });
    };

    return (
        <Card className="p-4 border-dashed border-2 border-gray-300 hover:border-primary transition">
            <CardContent className="flex flex-col items-center gap-4">
                <p className="text-center text-muted-foreground">
                    Upload a sustainability dataset in CSV format.
                </p>

                <Button onClick={() => inputRef.current?.click()}>
                    Upload CSV
                </Button>

                <input
                    ref={inputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </CardContent>
        </Card>
    );
}
