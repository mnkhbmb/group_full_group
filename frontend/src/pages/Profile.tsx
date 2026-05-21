import { useState } from "react";
import { User, Lock, Mail, Shield, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth, ROLE_LABELS } from "@/contexts/AuthContext";
import { usersApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.next !== pwForm.confirm) {
      toast({ title: "Алдаа", description: "Шинэ нууц үг таарахгүй байна", variant: "destructive" });
      return;
    }
    if (pwForm.next.length < 6) {
      toast({ title: "Алдаа", description: "Нууц үг хамгийн багадаа 6 тэмдэгт байна", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await usersApi.changePassword(user!.email, pwForm.current, pwForm.next);
      toast({ title: "Амжилттай", description: "Нууц үг амжилттай солигдлоо" });
      setPwForm({ current: "", next: "", confirm: "" });
    } catch (err: any) {
      toast({ title: "Алдаа", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      <h1 className="text-2xl font-bold">Профайл</h1>

      {/* Хэрэглэгчийн мэдээлэл */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Хувийн мэдээлэл</CardTitle>
          <CardDescription>Таны бүртгэлийн мэдээлэл</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold">{user?.name}</p>
              <Badge variant="secondary" className="mt-1">
                {user ? ROLE_LABELS[user.role] : ""}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4">
            <div className="flex items-center gap-3 text-sm">
              <User className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-muted-foreground text-xs">Нэр</p>
                <p className="font-medium">{user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-muted-foreground text-xs">И-мэйл / Нэвтрэх нэр</p>
                <p className="font-medium">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-muted-foreground text-xs">Утасны дугаар</p>
                <p className="font-medium">{user?.phone || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-muted-foreground text-xs">Эрх</p>
                <p className="font-medium">{user ? ROLE_LABELS[user.role] : ""}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Нууц үг солих */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Нууц үг солих
          </CardTitle>
          <CardDescription>Аюулгүй байдлын үүднээс нууц үгээ байнга солиорой</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label>Одоогийн нууц үг</Label>
              <Input
                type="password"
                placeholder="••••••"
                value={pwForm.current}
                onChange={(e) => setPwForm((p) => ({ ...p, current: e.target.value }))}
                disabled={loading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Шинэ нууц үг</Label>
              <Input
                type="password"
                placeholder="••••••"
                value={pwForm.next}
                onChange={(e) => setPwForm((p) => ({ ...p, next: e.target.value }))}
                disabled={loading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Шинэ нууц үг давтах</Label>
              <Input
                type="password"
                placeholder="••••••"
                value={pwForm.confirm}
                onChange={(e) => setPwForm((p) => ({ ...p, confirm: e.target.value }))}
                disabled={loading}
                required
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Солиж байна..." : "Нууц үг солих"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
