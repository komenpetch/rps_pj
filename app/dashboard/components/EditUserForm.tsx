import { useState } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

type User = {
    id: string;
    username: string;
    email?: string;
    role: string;
    score: number;
};

type EditUserFormProps = {
    user: User;
    onSave: (updatedUser: User) => Promise<void>;
    onCancel: () => void;
};

export default function EditUserForm({ user, onSave, onCancel }: EditUserFormProps) {
    const [editedUser, setEditedUser] = useState<User>({ ...user });
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/users/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editedUser),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update user');
            }

            await onSave(data.user);
            toast({
                title: "Success",
                description: "User updated successfully",
            });
        } catch (error) {
            console.error('Update error:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : 'Failed to update user',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-200">
                    Edit User: {user.username}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Username</label>
                        <Input
                            type="text"
                            value={editedUser.username}
                            onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })}
                            className="bg-gray-700 border-gray-600 text-gray-200"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Email</label>
                        <Input
                            type="email"
                            value={editedUser.email || ''}
                            onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                            className="bg-gray-700 border-gray-600 text-gray-200"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Role</label>
                        <Select
                            value={editedUser.role}
                            onValueChange={(value) => setEditedUser({ ...editedUser, role: value })}
                        >
                            <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-200">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700 border-gray-600">
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Score</label>
                        <Input
                            type="number"
                            value={editedUser.score}
                            onChange={(e) => setEditedUser({ 
                                ...editedUser, 
                                score: parseInt(e.target.value) || 0 
                            })}
                            className="bg-gray-700 border-gray-600 text-gray-200"
                        />
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={isLoading}
                            className="border-gray-600 text-gray-200 hover:bg-gray-700"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}