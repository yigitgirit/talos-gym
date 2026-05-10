"use client"

import * as React from "react"
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    type ColumnDef,
    type VisibilityState,
} from "@tanstack/react-table"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Columns3Icon,
    ChevronDownIcon,
    PlusIcon,
    ChevronsLeftIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronsRightIcon
} from "lucide-react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    pageCount: number
    totalElements: number
    onAddClick?: () => void
}

export function DataTable<TData, TValue>({
                                             columns,
                                             data,
                                             pageCount,
                                             totalElements,
                                             onAddClick
                                         }: DataTableProps<TData, TValue>) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

    // URL-based Pagination State
    const pageIndex = (Number(searchParams.get("page")) || 1) - 1
    const pageSize = Number(searchParams.get("size")) || 10

    // todo: it shouldn't know that!!
    const updateUrlParams = (updates: Record<string, string | number>) => {
        const newParams = new URLSearchParams(searchParams.toString())
        Object.entries(updates).forEach(([key, value]) => newParams.set(key, String(value)))
        router.push(`${pathname}?${newParams.toString()}`)
    }

    const table = useReactTable({
        data,
        columns,
        state: {
            columnVisibility,
            rowSelection,
            pagination: { pageIndex, pageSize },
        },
        pageCount,
        manualPagination: true,
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="w-full flex-col justify-start gap-6 flex">
            {/* Table Toolbar */}
            <div className="flex items-center justify-between px-4 lg:px-0">
                <div className="flex-1" /> {/* Spacer for future search/filters */}
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Columns3Icon className="mr-2 h-4 w-4" />
                                Columns
                                <ChevronDownIcon className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                            {table.getAllColumns().filter((col) => col.getCanHide()).map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    >
                                        {typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {onAddClick && (
                        <Button size="sm" onClick={onAddClick}>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            <span className="hidden lg:inline">Add New</span>
                        </Button>
                    )}
                </div>
            </div>

            {/* Table Body */}
            <div className="overflow-hidden rounded-lg border">
                <Table>
                    <TableHeader className="bg-muted/50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} colSpan={header.colSpan}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Advanced Pagination Footer */}
            <div className="flex items-center justify-between px-4 lg:px-0">
                <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
                    {table.getFilteredSelectedRowModel().rows.length} of {totalElements} row(s) selected.
                </div>
                <div className="flex w-full items-center gap-8 lg:w-fit">
                    <div className="hidden items-center gap-2 lg:flex">
                        <Label htmlFor="rows-per-page" className="text-sm font-medium">Rows per page</Label>
                        <Select
                            value={`${pageSize}`}
                            onValueChange={(value) => updateUrlParams({ size: value, page: 1 })}
                        >
                            <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                                <SelectValue placeholder={pageSize} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                <SelectGroup>
                                    {[10, 20, 30, 40, 50].map((size) => (
                                        <SelectItem key={size} value={`${size}`}>{size}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex w-fit items-center justify-center text-sm font-medium">
                        Page {pageIndex + 1} of {pageCount}
                    </div>
                    <div className="ml-auto flex items-center gap-2 lg:ml-0">
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => updateUrlParams({ page: 1 })}
                            disabled={pageIndex === 0}
                        >
                            <ChevronsLeftIcon className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="size-8 p-0"
                            onClick={() => updateUrlParams({ page: pageIndex })}
                            disabled={pageIndex === 0}
                        >
                            <ChevronLeftIcon className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="size-8 p-0"
                            onClick={() => updateUrlParams({ page: pageIndex + 2 })}
                            disabled={pageIndex >= pageCount - 1}
                        >
                            <ChevronRightIcon className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="hidden size-8 p-0 lg:flex"
                            onClick={() => updateUrlParams({ page: pageCount })}
                            disabled={pageIndex >= pageCount - 1}
                        >
                            <ChevronsRightIcon className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}