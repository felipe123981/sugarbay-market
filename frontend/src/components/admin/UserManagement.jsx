
    import React, { useState } from 'react';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Ban, Search, CheckCircle } from 'lucide-react';
    import { useToast } from "@/components/ui/use-toast";
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";

    const initialUsers = [
      { id: 'u1', name: 'Alice M.', email: 'alice@example.com', joinDate: '2024-10-01', status: 'Active', roles: ['Buyer', 'Seller'] },
      { id: 'u2', name: 'Bob K.', email: 'bob@example.com', joinDate: '2023-11-15', status: 'Active', roles: ['Buyer'] },
      { id: 'u3', name: 'Charlie P.', email: 'charlie@example.com', joinDate: '2024-01-20', status: 'Suspended', roles: ['Buyer', 'Seller'] },
      { id: 'u4', name: 'Demo User', email: 'demo@example.com', joinDate: '2023-05-05', status: 'Active', roles: ['Buyer', 'Seller', 'Admin'] },
    ];

    const UserManagement = () => {
      const [users, setUsers] = useState(initialUsers);
      const [searchTerm, setSearchTerm] = useState('');
      const { toast } = useToast();

      const handleUserStatusChange = (userId, newStatus) => {
        setUsers(users.map(user => user.id === userId ? { ...user, status: newStatus } : user));
        toast({ title: "User Updated", description: `User status changed to ${newStatus}.` });
      };

      const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return (
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>View, search, and manage platform users.</CardDescription>
             <div className="relative mt-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users by name or email..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
          </CardHeader>
          <CardContent>
            <Table>
               <TableCaption>{filteredUsers.length === 0 ? 'No users found matching your search.' : 'A list of platform users.'}</TableCaption>
               <TableHeader>
                 <TableRow>
                   <TableHead>Name</TableHead>
                   <TableHead>Email</TableHead>
                   <TableHead>Joined</TableHead>
                   <TableHead>Roles</TableHead>
                   <TableHead>Status</TableHead>
                   <TableHead className="text-right">Actions</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {filteredUsers.map((user) => (
                   <TableRow key={user.id}>
                     <TableCell className="font-medium">{user.name}</TableCell>
                     <TableCell>{user.email}</TableCell>
                     <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
                     <TableCell>{user.roles.join(', ')}</TableCell>
                     <TableCell>
                        <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {user.status}
                        </span>
                      </TableCell>
                     <TableCell className="text-right">
                       {user.status === 'Active' ? (
                         <Button variant="destructive" size="sm" onClick={() => handleUserStatusChange(user.id, 'Suspended')}>
                           <Ban className="mr-1 h-4 w-4" /> Suspend
                         </Button>
                       ) : (
                         <Button variant="secondary" size="sm" onClick={() => handleUserStatusChange(user.id, 'Active')}>
                           <CheckCircle className="mr-1 h-4 w-4" /> Reactivate
                         </Button>
                       )}
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
            </Table>
          </CardContent>
        </Card>
      );
    };

    export default UserManagement;
  