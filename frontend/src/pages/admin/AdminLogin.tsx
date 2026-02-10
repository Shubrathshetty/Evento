import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // User requested "fixed" credentials. 
            // We will still authenticate against backend for security, 
            // but purely UI-wise it looks like a dedicated portal.
            const { error } = await signIn(email, password);
            if (error) throw error;

            // We check role after login in the protected route, 
            // but we can also check here if we verify the decoded token.
            // For now, we assume if backend lets them in and they are admin (enforced by ProtectedRoute), it's fine.

            navigate("/admin");
            toast({
                title: "Welcome Admin",
                description: "Logged in to Admin Dashboard successfully.",
            });
        } catch (error) {
            toast({
                title: "Access Denied",
                description: "Invalid admin credentials.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072')] bg-cover bg-center opacity-20 pointer-events-none" />

            <Card className="w-full max-w-md z-10 border-gray-800 bg-gray-950 text-white shadow-2xl">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 rounded-full bg-event-purple/20 text-event-purple">
                            <Lock className="h-8 w-8" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Admin Portal</CardTitle>
                    <CardDescription className="text-gray-400">
                        Enter your secure credentials to access the dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Admin ID</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@evento.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-gray-900 border-gray-800 focus:border-event-purple"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-gray-900 border-gray-800 focus:border-event-purple"
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-event-purple hover:bg-event-dark-purple text-white font-semibold"
                            disabled={loading}
                        >
                            {loading ? "Authenticating..." : "Access Dashboard"}
                        </Button>

                        <div className="text-center text-xs text-gray-500 mt-4">
                            Authorized Personnel Only. <br />All actions are logged.
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminLogin;
