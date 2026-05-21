import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, UserCog, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { usersApi } from "@/lib/api";
import { ROLE_LABELS, type AppRole } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";

interface UserRecord {
  _id: string;
  email: string;
  name: string;
  role: AppRole;
  phone?: string;
}

const ROLES: AppRole[] = ["admin", "general_manager", "sales_manager", "engineer", "accountant", "user"];

const ROLE_COLORS: Record<AppRole, string> = {
  admin: "bg-red-100 text-red-700 border-red-200",
  general_manager: "bg-purple-100 text-purple-700 border-purple-200",
  sales_manager: "bg-blue-100 text-blue-700 border-blue-200",
  engineer: "bg-green-100 text-green-700 border-green-200",
  accountant: "bg-yellow-100 text-yellow-700 border-yellow-200",
  user: "bg-gray-100 text-gray-700 border-gray-200",
};

const emptyForm = { email: "", name: "", password: "", role: "user" as AppRole, phone: "" };

const Users = () => {
  const { user: me } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<UserRecord | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setUsers(await usersApi.getAll());
    } catch (err: any) {
      toast({ title: "Алдаа", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (u: UserRecord) => {
    setEditing(u);
    setForm({ email: u.email, name: u.name, password: "", role: u.role, phone: u.phone || "" });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.email || !form.name || (!editing && !form.password)) {
      toast({ title: "Алдаа", description: "Нэр, и-мэйл, нууц үгийг бөглөнө үү", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        const data: any = { name: form.name, role: form.role, phone: form.phone };
        if (form.password) data.password = form.password;
        await usersApi.update(editing._id, data);
        toast({ title: "Амжилттай", description: "Хэрэглэгч засагдлаа" });
      } else {
        await usersApi.create(form);
        toast({ title: "Амжилттай", description: "Хэрэглэгч үүслээ" });
      }
      setDialogOpen(false);
      load();
    } catch (err: any) {
      toast({ title: "Алдаа", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await usersApi.delete(deleteId);
      toast({ title: "Амжилттай", description: "Хэрэглэгч устгагдлаа" });
      setDeleteId(null);
      load();
    } catch (err: any) {
      toast({ title: "Алдаа", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <UserCog className="h-6 w-6" /> Хэрэглэгч удирдлага
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Нийт {users.length} хэрэглэгч</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Шинэ хэрэглэгч
        </Button>
      </div>

      <div className="grid gap-3">
        {loading ? (
          <p className="text-muted-foreground text-sm">Уншиж байна...</p>
        ) : users.length === 0 ? (
          <p className="text-muted-foreground text-sm">Хэрэглэгч байхгүй байна</p>
        ) : (
          users.map((u) => (
            <Card key={u._id}>
              <CardContent className="flex items-center justify-between py-4 px-5">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {u.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                    {u.phone && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Phone className="h-3 w-3" /> {u.phone}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full border font-medium ${ROLE_COLORS[u.role]}`}>
                    {ROLE_LABELS[u.role]}
                  </span>
                  <Button size="icon" variant="ghost" onClick={() => openEdit(u)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  {u.email !== me?.email && (
                    <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setDeleteId(u._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Үүсгэх / засах dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Хэрэглэгч засах" : "Шинэ хэрэглэгч"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Нэр <span className="text-destructive">*</span></Label>
              <Input placeholder="Овог нэр" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>И-мэйл / Нэвтрэх нэр <span className="text-destructive">*</span></Label>
              <Input placeholder="email@mail.mn" value={form.email} disabled={!!editing} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Утасны дугаар</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="99001122"
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{editing ? "Шинэ нууц үг (хоосон үлдээвэл өөрчлөгдөхгүй)" : "Нууц үг *"}</Label>
              <Input type="password" placeholder="••••••" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Эрх</Label>
              <Select value={form.role} onValueChange={(v) => setForm((p) => ({ ...p, role: v as AppRole }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Болих</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? "Хадгалж байна..." : "Хадгалах"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Устгах баталгаажуулалт */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Хэрэглэгч устгах уу?</AlertDialogTitle>
            <AlertDialogDescription>Энэ үйлдлийг буцаах боломжгүй.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Болих</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={handleDelete}>
              Устгах
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Users;
