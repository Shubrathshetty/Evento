import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AdminNavbar = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/admin/login');
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-gray-900 text-white">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link to="/admin" className="flex items-center space-x-2">
                        <Shield className="h-6 w-6 text-event-purple" />
                        <span className="text-xl font-bold">EventO Admin</span>
                    </Link>
                </div>

                <nav className="flex items-center gap-6 text-sm font-medium">
                    <Link to="/admin" className="transition-colors hover:text-event-purple">
                        Dashboard
                    </Link>
                    <Link to="/admin/events/new" className="transition-colors hover:text-event-purple">
                        Create Event
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400 mr-2">
                        {user?.email}
                    </span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="gap-2 text-white hover:bg-gray-800 hover:text-white">
                                <Settings className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-gray-950 text-white border-gray-800">
                            <DropdownMenuItem className="focus:bg-gray-800 focus:text-white cursor-pointer">
                                Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-gray-800" />
                            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-500 focus:text-red-400 focus:bg-gray-800">
                                <LogOut className="h-4 w-4 mr-2" />
                                Sign Out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
};

export default AdminNavbar;
