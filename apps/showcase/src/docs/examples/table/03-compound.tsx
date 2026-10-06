// title: Compound parts
// description: For full control, compose TableHeader, TableBody, TableRow, TableHead and TableCell.
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, StatusDot } from '@sam.barfield/field-react';

export default function TableCompound() {
  return (
    <div className="example-wide">
      <Table density="compact">
        <TableHeader>
          <TableRow>
            <TableHead>Endpoint</TableHead>
            <TableHead align="right">p99</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell><code>GET /v1/users</code></TableCell>
            <TableCell align="right">84 ms</TableCell>
            <TableCell><StatusDot status="success" label="OK" /></TableCell>
          </TableRow>
          <TableRow isSelected>
            <TableCell><code>POST /v1/orders</code></TableCell>
            <TableCell align="right">412 ms</TableCell>
            <TableCell><StatusDot status="warning" label="Slow" pulse /></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
