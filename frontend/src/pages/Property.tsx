import { useState, useMemo, useEffect } from "react";
import { Building2, Plus, Search, X, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { propertiesApi, objectsApi } from "@/lib/api";

interface PropertyRecord {
  _id: string;
  objectName: string;
  floor: string;
  areaId: string;
  areaSize: number;
  rentalAmount: number;
  pricePerSqm: number;
  managementFeePerSqm: number;
  status: "rented" | "vacant";
  createdAt?: string;
}

const emptyForm = {
  objectName: "",
  floor: "",
  areaId: "",
  areaSize: "",
  rentalAmount: "",
  pricePerSqm: "",
  managementFeePerSqm: "",
  status: "vacant" as "rented" | "vacant",
};

const formatMNT = (v: number) => v.toLocaleString("mn-MN") + "₮";

const Property = () => {
  const [records, setRecords] = useState<PropertyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [objects, setObjects] = useState<string[]>([]);
  const [objectDialogOpen, setObjectDialogOpen] = useState(false);
  const [newObjectName, setNewObjectName] = useState("");
  const { toast } = useToast();

  const load = async () => {
    try {
      setLoading(true);
      const [props, objs] = await Promise.all([propertiesApi.getAll(), objectsApi.getAll()]);
      setRecords(props);
      setObjects(objs.map((o: any) => o.name));
    } catch (err: any) {
      toast({ title: "Алдаа", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleAddObject = async () => {
    if (!newObjectName.trim()) return;
    try {
      await objectsApi.create(newObjectName.trim());
      setNewObjectName("");
      setObjectDialogOpen(false);
      toast({ title: "Амжилттай", description: "Шинэ объект нэмэгдлээ" });
      load();
    } catch (err: any) {
      toast({ title: "Алдаа", description: err.message, variant: "destructive" });
    }
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return records;
    const q = search.toLowerCase();
    return records.filter(
      (r) =>
        r.objectName.toLowerCase().includes(q) ||
        r.areaId.toLowerCase().includes(q) ||
        r.floor.includes(q)
    );
  }, [search, records]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (r: PropertyRecord) => {
    setEditingId(r._id);
    setForm({
      objectName: r.objectName,
      floor: r.floor,
      areaId: r.areaId,
      areaSize: String(r.areaSize),
      rentalAmount: String(r.rentalAmount),
      pricePerSqm: String(r.pricePerSqm),
      managementFeePerSqm: String(r.managementFeePerSqm ?? 0),
      status: r.status,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.objectName || !form.areaId) {
      toast({ title: "Алдаа", description: "Заавал бөглөх талбаруудыг бөглөнө үү", variant: "destructive" });
      return;
    }
    const data = {
      objectName: form.objectName,
      floor: form.floor,
      areaId: form.areaId,
      areaSize: Number(form.areaSize) || 0,
      rentalAmount: Number(form.rentalAmount) || 0,
      pricePerSqm: Number(form.pricePerSqm) || 0,
      managementFeePerSqm: Number(form.managementFeePerSqm) || 0,
      status: form.status,
    };
    try {
      if (editingId) {
        await propertiesApi.update(editingId, data);
        toast({ title: "Амжилттай", description: "Шинэчлэгдлээ" });
      } else {
        await propertiesApi.create(data);
        toast({ title: "Амжилттай", description: "Хөрөнгө бүртгэгдлээ" });
      }
      setForm(emptyForm);
      setEditingId(null);
      setDialogOpen(false);
      load();
    } catch (err: any) {
      toast({ title: "Алдаа", description: err.message, variant: "destructive" });
    }
  };

  const updateField = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Хөрөнгө</h1>
            <p className="text-sm text-muted-foreground">Нийт {records.length} бүртгэл</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setObjectDialogOpen(true)} className="gap-2">
            <Building2 className="h-4 w-4" /> Объект нэмэх
          </Button>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" /> Шинээр бүртгэх
          </Button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Хайлт... (объект, талбай ID, давхар)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-10"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Хөрөнгийн жагсаалт</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Объект</TableHead>
                  <TableHead>Давхар</TableHead>
                  <TableHead>Талбай ID</TableHead>
                  <TableHead>Хэмжээ</TableHead>
                  <TableHead>МКВ дүн</TableHead>
                  <TableHead className="hidden lg:table-cell">Менежмент ₮/м²</TableHead>
                  <TableHead>Түрээсийн дүн</TableHead>
                  <TableHead>Төлөв</TableHead>
                  <TableHead className="text-right">Үйлдэл</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">
                      Уншиж байна...
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">
                      Бүртгэл байхгүй байна
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((r) => (
                    <TableRow key={r._id}>
                      <TableCell className="font-medium">{r.objectName}</TableCell>
                      <TableCell>{r.floor}-р давхар</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">{r.areaId}</Badge>
                      </TableCell>
                      <TableCell>{r.areaSize} м²</TableCell>
                      <TableCell>{formatMNT(r.pricePerSqm)}</TableCell>
                      <TableCell className="hidden lg:table-cell">{formatMNT(r.managementFeePerSqm)}</TableCell>
                      <TableCell className="font-medium">{formatMNT(r.rentalAmount)}</TableCell>
                      <TableCell>
                        <Badge variant={r.status === "rented" ? "default" : "secondary"}>
                          {r.status === "rented" ? "Түрээслэсэн" : "Сул"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(r)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Хөрөнгө засварлах" : "Хөрөнгө шинээр бүртгэх"}</DialogTitle>
            <DialogDescription>Бүх шаардлагатай мэдээллийг бөглөнө үү</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Объект *</Label>
              {objects.length === 0 ? (
                <Input
                  placeholder="Объектын нэр"
                  value={form.objectName}
                  onChange={(e) => updateField("objectName", e.target.value)}
                />
              ) : (
                <Select value={form.objectName} onValueChange={(v) => updateField("objectName", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Объект сонгох" />
                  </SelectTrigger>
                  <SelectContent>
                    {objects.map((obj) => (
                      <SelectItem key={obj} value={obj}>{obj}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-2">
              <Label>Давхар</Label>
              <Input placeholder="12" value={form.floor} onChange={(e) => updateField("floor", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Талбайн дугаарлалт (ID) *</Label>
              <Input placeholder="A-1201" value={form.areaId} onChange={(e) => updateField("areaId", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Талбайн хэмжээ (м²)</Label>
              <Input type="number" placeholder="85" value={form.areaSize} onChange={(e) => updateField("areaSize", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Түрээсийн дүн (₮)</Label>
              <Input type="number" placeholder="2550000" value={form.rentalAmount} onChange={(e) => updateField("rentalAmount", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>МКВ дүн (₮/м²)</Label>
              <Input type="number" placeholder="30000" value={form.pricePerSqm} onChange={(e) => updateField("pricePerSqm", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Менежментийн төлбөр (₮/м²)</Label>
              <Input type="number" placeholder="5000" value={form.managementFeePerSqm} onChange={(e) => updateField("managementFeePerSqm", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Төлөв</Label>
              <Select value={form.status} onValueChange={(v) => updateField("status", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rented">Түрээслэсэн</SelectItem>
                  <SelectItem value="vacant">Сул</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Болих</Button>
            <Button onClick={handleSubmit}>{editingId ? "Хадгалах" : "Бүртгэх"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Object Dialog */}
      <Dialog open={objectDialogOpen} onOpenChange={setObjectDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Шинэ объект нэмэх</DialogTitle>
            <DialogDescription>Объектын нэрийг оруулна уу</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Объектын нэр *</Label>
            <Input
              placeholder="Жишээ: Алтай Тауэр"
              value={newObjectName}
              onChange={(e) => setNewObjectName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddObject()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setObjectDialogOpen(false)}>Болих</Button>
            <Button onClick={handleAddObject}>Нэмэх</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Property;
