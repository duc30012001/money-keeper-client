import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export function AccountTypesTableSkeleton() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Sort Order</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                        <TableCell>
                            <Skeleton className="h-8 w-8 rounded" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-[100px]" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-[200px]" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-[50px]" />
                        </TableCell>
                        <TableCell>
                            <div className="flex gap-2">
                                <Skeleton className="h-8 w-8 rounded" />
                                <Skeleton className="h-8 w-8 rounded" />
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
