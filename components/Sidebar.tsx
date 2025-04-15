import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useRouter } from 'next/navigation';


const FormSchema = z.object({
    filterColumns: z.string().array().min(2),
    sortBy: z.string().nonempty("Please select a sort option"),
    sortOrder: z.enum(["asc", "desc"]),
    columnPie: z.string().nonempty("Please select a column for pie chart"),
})

export default function sidebar({
    headers,
    rows,
}: {
    headers: string[];
    rows: Record<string, any>[];
}) {
    const router = useRouter();
    const [filterColumn, setFilterColumn] = useState<string>(headers[0] || '');
    const [filterValue, setFilterValue] = useState<string>('');
    const [sortColumn, setSortColumn] = useState<string>(headers[0] || '');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [visualizeTypes, setVisualizeTypes] = useState<'line' | 'bar' | 'pie'>('line');

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            filterColumns: headers,
            sortBy: headers[0],
            sortOrder: "asc",
            columnPie: headers[0],
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data)
        const params = new URLSearchParams();

        data.filterColumns.forEach(col => params.append("filter", col));
        params.set("sortBy", data.sortBy);
        params.set("sortOrder", data.sortOrder);
        params.set("columnPie", data.columnPie);

        router.push(`/visualize?${params.toString()}`);
    }


    return (
        <>
            {/* Sidebar */}
            <aside className="w-72 bg-gray-100 border-r overflow-y-auto p-4 space-y-6">
                <h1 className="text-2xl font-bold my-4">Sidebar</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        {/* FilterColumns */}
                        <FormField
                            control={form.control}
                            name="filterColumns"
                            render={() => (
                                <FormItem>
                                    <div className="mb-4">
                                        <FormLabel className="text-base">Filter Columns</FormLabel>
                                        <FormDescription>
                                            Select the items you want to display.
                                        </FormDescription>
                                    </div>
                                    {headers.map((item) => (
                                        <FormField
                                            key={item}
                                            control={form.control}
                                            name="filterColumns"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem
                                                        key={item}
                                                        className="flex flex-row items-start space-x-3 space-y-0"
                                                    >
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(item)}
                                                                onCheckedChange={(checked) => {
                                                                    return checked
                                                                        ? field.onChange([...field.value, item])
                                                                        : field.onChange(
                                                                            field.value?.filter(
                                                                                (value) => value !== item
                                                                            )
                                                                        )
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="text-sm font-normal">
                                                            {item}
                                                        </FormLabel>
                                                    </FormItem>
                                                )
                                            }}
                                        />
                                    ))}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* SortBy */}
                        <FormField
                            control={form.control}
                            name="sortBy"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sort By</FormLabel>
                                    <FormControl>
                                        <select
                                            {...field}
                                            className="w-full border border-gray-300 rounded-md p-2"
                                        >
                                            {headers.map((item) => (
                                                <option key={item} value={item}>
                                                    {item}
                                                </option>
                                            ))}
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* SortOrder */}
                        <FormField
                            control={form.control}
                            name="sortOrder"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sort Order</FormLabel>
                                    <FormControl>
                                        <select
                                            {...field}
                                            className="w-full border border-gray-300 rounded-md p-2"
                                        >
                                            <option value="asc">Ascending</option>
                                            <option value="desc">Descending</option>
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="columnPie"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pie chart</FormLabel>
                                    <FormDescription>
                                        Select the column you want to visualize in a pie chart.
                                    </FormDescription>
                                    <FormControl>
                                        <select
                                            {...field}
                                            className="w-full border border-gray-300 rounded-md p-2"
                                        >
                                            {headers.map((item) => (
                                                <option key={item} value={item}>
                                                    {item}
                                                </option>
                                            ))}
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit">Showtime!!</Button>
                    </form>
                </Form>


            </aside>
        </>
    )
}
