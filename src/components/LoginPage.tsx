
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface LoginPageProps {
  onLogin: (userid: string) => void;
}

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userid || !password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter both User ID and password",
      });
      return;
    }

    setIsLoading(true);
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Login Successful",
        description: `Welcome to Data Quality Framework, ${userid}`,
      });
      onLogin(userid);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Enterprise Data Quality Framework
          </CardTitle>
          <CardDescription className="text-gray-600">
            Sign in with your credentials to access the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userid" className="text-sm font-medium text-gray-700">
                User ID
              </Label>
              <Input
                id="userid"
                type="text"
                placeholder="Enter your User ID"
                value={userid}
                onChange={(e) => setUserid(e.target.value)}
                className="w-full"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
