'use client';
export default function RPSPage() {
    const handleLogout = () => {
        localStorage.removeItem('session');
        window.location.href = '/login';
    };    
    return (
        <div>
            <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
                >
                Logout
            </button>
        </div>
    )
}