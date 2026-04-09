import { useState } from "react";
import { Building2, LogIn, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const { login, register } = useAuth();
  const { toast } = useToast();
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ email: "", password: "", name: "" });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!login(loginForm.email, loginForm.password)) {
      toast({ title: "Алдаа", description: "И-мэйл эсвэл нууц үг буруу байна", variant: "destructive" });
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerForm.email || !registerForm.password || !registerForm.name) {
      toast({ title: "Алдаа", description: "Бүх талбарыг бөглөнө үү", variant: "destructive" });
      return;
    }
    if (!register(registerForm.email, registerForm.password, registerForm.name)) {
      toast({ title: "Алдаа", description: "Энэ и-мэйл хаягаар бүртгэл үүссэн байна", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-xl">Хөрөнгийн Менежмент</CardTitle>
          <CardDescription>Системд нэвтрэх эсвэл бүртгүүлэх</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Нэвтрэх</TabsTrigger>
              <TabsTrigger value="register">Бүртгүүлэх</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>И-мэйл / Нэвтрэх нэр</Label>
                  <Input
                    placeholder="admin"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Нууц үг</Label>
                  <Input
                    type="password"
                    placeholder="••••••"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                  />
                </div>
                <Button type="submit" className="w-full gap-2">
                  <LogIn className="h-4 w-4" /> Нэвтрэх
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Нэр</Label>
                  <Input
                    placeholder="Таны нэр"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm((p) => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>И-мэйл хаяг</Label>
                  <Input
                    type="email"
                    placeholder="email@mail.mn"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm((p) => ({ ...p, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Нууц үг</Label>
                  <Input
                    type="password"
                    placeholder="••••••"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm((p) => ({ ...p, password: e.target.value }))}
                  />
                </div>
                <Button type="submit" className="w-full gap-2">
                  <UserPlus className="h-4 w-4" /> Бүртгүүлэх
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
