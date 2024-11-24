import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react";

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onSave(editedUser);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-gray-200">Edit User</CardTitle>
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
                        <label className="text-sm text-gray-400">Score</label>
                        <Input
                            type="number"
                            value={editedUser.score}
                            onChange={(e) => setEditedUser({ ...editedUser, score: parseInt(e.target.value, 10) })}
                            className="bg-gray-700 border-gray-600 text-gray-200"
                        />
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
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