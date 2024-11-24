import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { Button } from "@/components/ui/button"
  import { Edit, Trash2 } from "lucide-react"
  
  type User = {
      id: string;
      username: string;
      email?: string;
      role: string;
      score: number;
  };
  
  type AdminTableProps = {
      users: User[];
      onEdit: (user: User) => void;
      onDelete: (id: string) => void;
  };
  
  export default function AdminTable({ users, onEdit, onDelete }: AdminTableProps) {
      return (
          <div className="rounded-md border border-gray-700">
              <Table>
                  <TableHeader>
                      <TableRow className="hover:bg-gray-800/50">
                          <TableHead className="text-gray-400">Username</TableHead>
                          <TableHead className="text-gray-400">Email</TableHead>
                          <TableHead className="text-gray-400">Role</TableHead>
                          <TableHead className="text-gray-400 text-right">Score</TableHead>
                          <TableHead className="text-gray-400 text-right">Actions</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {users.map((user) => (
                          <TableRow key={user.id} className="hover:bg-gray-800/50">
                              <TableCell className="font-medium text-gray-300">
                                  {user.username}
                              </TableCell>
                              <TableCell className="text-gray-300">
                                  {user.email || 'N/A'}
                              </TableCell>
                              <TableCell className="text-gray-300">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                      user.role === 'admin' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                                  }`}>
                                      {user.role}
                                  </span>
                              </TableCell>
                              <TableCell className="text-right text-gray-300">
                                  {user.score}
                              </TableCell>
                              <TableCell className="text-right space-x-2">
                                  <Button
                                      onClick={() => onEdit(user)}
                                      variant="ghost"
                                      size="sm"
                                      className="hover:bg-yellow-500/20 text-yellow-400"
                                  >
                                      <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                      onClick={() => onDelete(user.id)}
                                      variant="ghost"
                                      size="sm"
                                      className="hover:bg-red-500/20 text-red-400"
                                  >
                                      <Trash2 className="h-4 w-4" />
                                  </Button>
                              </TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
          </div>
      );
  }