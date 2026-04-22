"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, MapPin, Users, X, Trash2 } from "lucide-react";

// Rozszerzone dane testowe
const ALL_MOCK_TRIPS = [
  { id: "1", name: "Majówka w Rzymie", status: "W trakcie", budget: 92, dates: "10.05.2026 - 15.05.2026", participants: 4 },
  { id: "2", name: "Weekend w Berlinie", status: "Planowana", budget: 0, dates: "20.06.2026 - 22.06.2026", participants: 2 },
  { id: "3", name: "Narty w Alpach", status: "Zakończona", budget: 100, dates: "15.01.2026 - 22.01.2026", participants: 6 },
  { id: "4", name: "Szlakiem Zamków", status: "Planowana", budget: 15, dates: "12.08.2026 - 18.08.2026", participants: 3 },
  { id: "5", name: "Korfu 2025", status: "Zakończona", budget: 88, dates: "01.07.2025 - 10.07.2025", participants: 5 },
];

export default function TripsListPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Wszystkie statusy");

  const filteredTrips = ALL_MOCK_TRIPS.filter(trip => {
    const matchesSearch = trip.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "Wszystkie statusy" || trip.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-300">
        
        {/* NAGŁÓWEK */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold text-[#0a0b0d] tracking-tighter mb-2">Moje Podróże</h1>
            <p className="text-[#5b616e] text-lg">Przeglądaj i zarządzaj wszystkimi swoimi wyjazdami.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto px-8 py-4 bg-[#0a2351] hover:bg-[#578bfa] text-white font-bold rounded-[56px] transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            <span>Nowa Podróż</span>
          </button>
        </div>

        {/* WYSZUKIWARKA I FILTRY */}
        <div className="flex flex-col sm:flex-row gap-4 bg-[#ffffff] p-4 rounded-[24px] border border-[#5b616e]/20">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5b616e]" size={20} />
            <input
              type="text"
              placeholder="Szukaj podróży po nazwie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#f8f9fa] border border-transparent rounded-full pl-12 pr-4 py-3 text-[#0a0b0d] focus:outline-none focus:border-[#0a2351] transition-colors"
            />
          </div>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#f8f9fa] border border-transparent rounded-full px-6 py-3 text-[#0a0b0d] font-medium focus:outline-none focus:border-[#0a2351] transition-colors cursor-pointer appearance-none pr-10"
            style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%235b616e%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
          >
            <option value="Wszystkie statusy">Wszystkie statusy</option>
            <option value="W trakcie">W trakcie</option>
            <option value="Planowana">Planowane</option>
            <option value="Zakończona">Zakończone</option>
          </select>
        </div>

        {/* LISTA PODRÓŻY */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <div
              key={trip.id}
              onClick={() => router.push(`/trips/${trip.id}`)}
              className="bg-[#ffffff] p-8 rounded-[32px] border border-[#5b616e]/20 hover:border-[#0a2351] hover:shadow-lg transition-all cursor-pointer group flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-6">
                 <span className={`px-4 py-1.5 text-xs font-bold rounded-full ${
                  trip.status === "W trakcie" ? "bg-green-100 text-green-800" :
                  trip.status === "Planowana" ? "bg-blue-100 text-[#3E67BF]" :
                  "bg-[#eef0f3] text-[#5b616e]"
                }`}>
                  {trip.status}
                </span>
                <span className="text-[#5b616e] text-sm font-medium bg-[#f8f9fa] px-3 py-1 rounded-full">{trip.dates}</span>
              </div>

              <h3 className="text-2xl font-bold text-[#0a0b0d] tracking-tight mb-4 group-hover:text-[#3E67BF] transition-colors">
                {trip.name}
              </h3>
              
              <div className="flex items-center gap-6 text-[#5b616e] text-sm mb-8 flex-1">
                <span className="flex items-center gap-2 bg-[#f8f9fa] px-3 py-1.5 rounded-full">
                  <Users size={16} className="text-[#0a2351]" /> 
                  <span className="font-bold text-[#0a0b0d]">{trip.participants}</span> os.
                </span>
                <span className="flex items-center gap-2 bg-[#f8f9fa] px-3 py-1.5 rounded-full">
                  <MapPin size={16} className="text-[#0a2351]" /> 
                  <span className="font-bold text-[#0a0b0d]">UE</span>
                </span>
              </div>

              <div className="space-y-3 mt-auto">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-[#5b616e]">Zużycie budżetu</span>
                  <span className={trip.budget > 90 ? "text-red-600" : "text-[#0a0b0d]"}>{trip.budget}%</span>
                </div>
                <div className="w-full bg-[#eef0f3] h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 rounded-full ${trip.budget > 90 ? 'bg-red-500' : 'bg-[#0a2351]'}`}
                    style={{ width: `${trip.budget}%` }}
                  />
                </div>
              </div>
            </div>
          ))}

          {filteredTrips.length === 0 && (
            <div className="col-span-full text-center py-20 bg-[#f8f9fa] rounded-[40px] border border-dashed border-[#5b616e]/30">
              <p className="text-[#5b616e] text-lg">Nie znaleźliśmy podróży o statusie: <span className="text-[#0a0b0d] font-bold">{statusFilter}</span>.</p>
            </div>
          )}
        </div>
      </div>

      {/* RENDEROWANIE MODALA */}
      {isModalOpen && <NewTripModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}

// ------------------------------------------------------------------
// KOMPONENT MODALA
// ------------------------------------------------------------------
function NewTripModal({ onClose }: { onClose: () => void }) {
  const [participants, setParticipants] = useState<string[]>([""]);

  const addParticipant = () => setParticipants([...participants, ""]);
  
  const updateParticipant = (index: number, value: string) => {
    const newParts = [...participants];
    newParts[index] = value;
    setParticipants(newParts);
  };

  const removeParticipant = (indexToRemove: number) => {
    setParticipants(participants.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="fixed inset-0 z-[100] w-screen h-screen bg-[#0a0b0d]/20 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-[#ffffff] border border-[#5b616e]/20 w-full max-w-xl rounded-[40px] p-10 shadow-2xl animate-in fade-in zoom-in duration-200">
        
        <div className="flex justify-between items-start mb-8">
          <h2 className="text-3xl font-bold text-[#0a0b0d] tracking-tight">Stwórz nową podróż</h2>
          <button onClick={onClose} className="p-2 text-[#5b616e] hover:text-[#0a0b0d] hover:bg-[#f8f9fa] rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <form className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[1px] text-[#5b616e] pl-4">Nazwa podróży</label>
              <input 
                type="text" 
                placeholder="np. Eurotrip 2026"
                className="w-full bg-[#f8f9fa] border border-[#5b616e]/20 rounded-full px-6 py-4 text-[#0a0b0d] focus:outline-none focus:border-[#0a2351] transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[1px] text-[#5b616e] pl-4">Główna waluta</label>
              <select className="w-full bg-[#f8f9fa] border border-[#5b616e]/20 rounded-full px-6 py-4 text-[#0a0b0d] focus:outline-none focus:border-[#0a2351] transition-colors appearance-none cursor-pointer">
                <option value="EUR">Euro (EUR) - Domyślna</option>
                <option value="PLN">Złoty (PLN)</option>
                <option value="CZK">Korona czeska (CZK)</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 bg-[#f8f9fa] p-6 rounded-[24px]">
            <label className="text-[11px] font-bold uppercase tracking-[1px] text-[#5b616e]">Uczestnicy</label>
            
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {participants.map((p, index) => (
                <div key={index} className="flex gap-3 items-center animate-in fade-in slide-in-from-left-2 duration-200">
                  <input 
                    type="text"
                    value={p}
                    onChange={(e) => updateParticipant(index, e.target.value)}
                    placeholder={`Imię uczestnika ${index + 1}`}
                    className="flex-1 bg-[#ffffff] border border-[#5b616e]/20 rounded-full px-5 py-3 text-[#0a0b0d] focus:outline-none focus:border-[#0a2351] transition-colors"
                  />
                  {index > 0 && (
                    <button 
                      type="button"
                      onClick={() => removeParticipant(index)}
                      className="p-3 text-[#5b616e] hover:text-red-500 hover:bg-red-50 rounded-full transition-colors shrink-0"
                      title="Usuń uczestnika"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button 
              type="button"
              onClick={addParticipant}
              className="text-[#3E67BF] font-bold hover:text-[#0a2351] transition-colors flex items-center gap-2 mt-2"
            >
              <Plus size={16} /> Dodaj kolejną osobę
            </button>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="w-full px-8 py-4 bg-[#f8f9fa] hover:bg-[#eef0f3] text-[#0a0b0d] font-bold rounded-[56px] transition-colors"
            >
              Anuluj
            </button>
            <button 
              type="button"
              onClick={onClose} 
              className="w-full px-8 py-4 bg-[#0a2351] hover:bg-[#578bfa] text-white font-bold rounded-[56px] transition-colors"
            >
              Stwórz podróż
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}