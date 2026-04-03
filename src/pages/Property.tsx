import { Building2 } from "lucide-react";

const Property = () => {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Building2 className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Хөрөнгө</h1>
      </div>
      <p className="text-muted-foreground">Хөрөнгийн бүртгэл, удирдлагын хуудас.</p>
    </div>
  );
};

export default Property;
