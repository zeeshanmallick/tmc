import React from 'react';
import { User } from '@/lib/db/schema'; // Assuming schema types are defined
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Mock user data - replace with actual data later
const mockUsers: User[] = [
  { id: 'user1', email: 'investor.a@example.com', role: 'INVESTOR', createdAt: new Date(), updatedAt: new Date() },
  { id: 'user2', email: 'company.x@example.com', role: 'COMPANY', createdAt: new Date(), updatedAt: new Date() },
  { id: 'user3', email: 'admin@mastercollective.com', role: 'ADMIN', createdAt: new Date(), updatedAt: new Date() },
  { id: 'user4', email: 'company.y@example.com', role: 'COMPANY', createdAt: new Date(), updatedAt: new Date() },
];

interface UserTableProps {
  users: User[];
}

const UserTable: React.FC<UserTableProps> = ({ users = mockUsers }) => {
  return (
    <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Manage Users</h3>
      <Table>
        <TableHeader>
          <TableRow className="border-gray-700 hover:bg-gray-800">
            <TableHead className="text-white">Email</TableHead>
            <TableHead className="text-white">Role</TableHead>
            <TableHead className="text-white">Created At</TableHead>
            <TableHead className="text-white text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="border-gray-700 hover:bg-gray-800">
              <TableCell className="font-medium text-gray-300">{user.email}</TableCell>
              <TableCell>
                <Badge 
                  variant={user.role === 'ADMIN' ? 'destructive' : user.role === 'COMPANY' ? 'secondary' : 'default'}
                  className={`${user.role === 'ADMIN' ? 'bg-red-600' : user.role === 'COMPANY' ? 'bg-blue-600' : 'bg-green-600'} text-white`}
                >
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-400">{user.createdAt.toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" className="mr-2 bg-gray-700 border-gray-600 hover:bg-gray-600 text-white">
                  View
                </Button>
                <Button variant="destructive" size="sm" className="bg-red-700 hover:bg-red-600 text-white">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
