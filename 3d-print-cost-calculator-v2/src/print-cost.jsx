import { useState, useEffect } from "react";

export default function PrintCostCalculator() {
  const [filament, setFilament] = useState(250);
  const [hours, setHours] = useState(17);
  const [minutes, setMinutes] = useState(18);
  const [power, setPower] = useState(110);
  const [spoolPrice, setSpoolPrice] = useState(500);
  const [spoolWeight, setSpoolWeight] = useState(1000);
  const [pricePerKWh, setPricePerKWh] = useState(3.6);
  const [records, setRecords] = useState([]);
  const [partName, setPartName] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("baski_kayitlari");
    if (stored) {
      setRecords(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("baski_kayitlari", JSON.stringify(records));
  }, [records]);

  const totalHours = hours + minutes / 60;
  const pricePerGram = spoolPrice / spoolWeight;
  const filamentCost = filament * pricePerGram;
  const energyKWh = (power / 1000) * totalHours;
  const electricityCost = energyKWh * pricePerKWh;
  const totalCost = filamentCost + electricityCost;

  const resetFields = () => {
    setFilament(0);
    setHours(0);
    setMinutes(0);
    setPower(0);
    setSpoolPrice(0);
    setSpoolWeight(1000);
    setPricePerKWh(0);
    setPartName("");
  };

  const saveRecord = () => {
    const newRecord = {
      partName,
      filament,
      hours,
      minutes,
      power,
      spoolPrice,
      total: totalCost.toFixed(2)
    };
    setRecords([newRecord, ...records]);
  };

  const exportCSV = () => {
    const header = "Parça Adı,Filament (g),Saat,Dakika,Güç (W),Rulo Fiyatı (₺),Toplam Maliyet (₺)\n";
    const rows = records.map(r => `${r.partName},${r.filament},${r.hours},${r.minutes},${r.power},${r.spoolPrice},${r.total}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "baski_maliyetleri.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col lg:flex-row max-w-6xl mx-auto p-4 gap-4">
      <div className="lg:w-2/3 w-full p-4 border rounded-xl shadow-xl">
        <h1 className="text-xl font-bold">3D Baskı Maliyet Hesaplayıcı</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label>
            Parça Adı:
            <input type="text" value={partName} onChange={e => setPartName(e.target.value)} className="w-full p-2 border rounded" />
          </label>

          <label>
            Filament (g):
            <input type="number" value={filament} onChange={e => setFilament(+e.target.value)} className="w-full p-2 border rounded" />
          </label>

          <label>
            Baskı Süresi (saat):
            <input type="number" value={hours} onChange={e => setHours(+e.target.value)} className="w-full p-2 border rounded" />
          </label>

          <label>
            Baskı Süresi (dakika):
            <input type="number" value={minutes} onChange={e => setMinutes(+e.target.value)} className="w-full p-2 border rounded" />
          </label>

          <label>
            Yazıcı Gücü (W):
            <input type="number" value={power} onChange={e => setPower(+e.target.value)} className="w-full p-2 border rounded" />
          </label>

          <label>
            Filament Fiyatı (₺ / rulo):
            <input type="number" value={spoolPrice} onChange={e => setSpoolPrice(+e.target.value)} className="w-full p-2 border rounded" />
          </label>

          <label>
            Elektrik Fiyatı (₺ / kWh):
            <input type="number" step="0.01" value={pricePerKWh} onChange={e => setPricePerKWh(+e.target.value)} className="w-full p-2 border rounded" />
          </label>
        </div>

        <div className="border-t pt-4 space-y-2">
          <p><strong>Filament Maliyeti:</strong> {filamentCost.toFixed(2)} TL</p>
          <p><strong>Elektrik Maliyeti:</strong> {electricityCost.toFixed(2)} TL</p>
          <p><strong>Toplam Maliyet:</strong> {totalCost.toFixed(2)} TL</p>
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          <button onClick={resetFields} className="px-4 py-2 bg-red-500 text-white rounded">Sıfırla</button>
          <button onClick={saveRecord} className="px-4 py-2 bg-green-600 text-white rounded">Kaydet</button>
          <button onClick={exportCSV} className="px-4 py-2 bg-blue-600 text-white rounded">CSV Dışa Aktar</button>
        </div>
      </div>

      <div className="lg:w-1/3 w-full p-4 border rounded-xl shadow-xl">
        <h2 className="text-lg font-bold mb-2">Kayıtlı Maliyetler</h2>
        <ul className="space-y-2 text-sm">
          {records.map((r, i) => (
            <li key={i} className="p-2 border rounded bg-gray-100">
              <strong>{r.partName || "(İsimsiz)"}</strong><br />
              {r.filament}g, {r.hours}sa {r.minutes}dk → <strong>{r.total} TL</strong>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}