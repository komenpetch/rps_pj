'use client';

type User = {
    id: string;
    username: string;
    email?: string;
    role: string;
    score: number;
};

type EditUserFormProps = {
    editUser: User;
    setEditUser: React.Dispatch<React.SetStateAction<User | null>>;
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
};

export default function EditUserForm({
    editUser,
    setEditUser,
    setUsers,
}: EditUserFormProps) {
    const handleUpdate = async () => {
        try {
            const response = await fetch('/api/users/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editUser),
            });
            if (!response.ok) throw new Error('Failed to update user');
            
            // Update the users list optimistically
            setUsers(prev => 
                prev.map(user => 
                    user.id === editUser.id ? editUser : user
                )
            );
            
            setEditUser(null);
            
            // Then fetch the latest data
            const updatedUsers = await fetch('/api/users/get').then((res) => res.json());
            setUsers(updatedUsers);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="bg-gray-800 p-4 rounded-md shadow-md">
            <h3 className="text-xl font-bold mb-4">Edit User</h3>
            <input
                type="text"
                value={editUser.username}
                onChange={(e) =>
                    setEditUser((prev) => prev && { ...prev, username: e.target.value })
                }
                className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded mb-2"
            />
            <input
                type="number"
                value={editUser.score}
                onChange={(e) =>
                    setEditUser((prev) => prev && { ...prev, score: parseInt(e.target.value, 10) })
                }
                className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded mb-2"
            />
            <button
                onClick={handleUpdate}
                className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
                Save
            </button>
            <button
                onClick={() => setEditUser(null)}
                className="ml-2 bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
            >
                Cancel
            </button>
        </div>
    );
}