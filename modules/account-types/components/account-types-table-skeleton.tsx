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
                    <TableHead className="w-20"></TableHead>
                    <TableHead className="w-48">Name</TableHead>
                    <TableHead className="w-60">Description</TableHead>
                    <TableHead className="w-20">Actions</TableHead>
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
