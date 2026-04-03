import { Receipt } from "lucide-react";

const Finance = () => {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Receipt className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Санхүү бүртгэл</h1>
      </div>
      <p className="text-muted-foreground">Санхүүгийн бүртгэл, тайлангийн хуудас.</p>
    </div>
  );
};

export default Finance;
