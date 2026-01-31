"use client";

import { useState } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    Save,
    X,
    Settings2,
    Scale,
    Coins,
    CheckCircle2,
    XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
    submitTypeFood,
    deleteTypeFood,
    submitCurrency,
    deleteCurrency
} from "@/app/[lang]/super-admin-depo/settings/actions";

interface SystemSettingsProps {
    initialTypeFoods: any[];
    initialCurrencies: any[];
}

export default function SystemSettings({ initialTypeFoods, initialCurrencies }: SystemSettingsProps) {
    const [typeFoods, setTypeFoods] = useState(initialTypeFoods);
    const [currencies, setCurrencies] = useState(initialCurrencies);
    const [isLoading, setIsLoading] = useState(false);

    // Modal States
    const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
    const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    // Form States
    const [typeFormData, setTypeFormData] = useState({ title: "", status: "active", sort: "0" });
    const [currencyFormData, setCurrencyFormData] = useState({ title: "", symbol: "", exchangeRateToUsd: "1", status: "active" });

    // --- Type Food Handlers ---

    const handleTypeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const res = await submitTypeFood(typeFormData, editingItem?.id);
        if (res.ok) {
            toast.success("Unit saved successfully");
            setIsTypeModalOpen(false);
            window.location.reload(); // Simple refresh to sync state
        } else {
            toast.error(res.error || "Failed to save");
        }
        setIsLoading(false);
    };

    const handleDeleteType = async (id: string) => {
        if (!confirm("Are you sure? This might affect products using this unit.")) return;
        const res = await deleteTypeFood(id);
        if (res.ok) {
            toast.success("Unit deleted");
            setTypeFoods(typeFoods.filter(tf => tf.id !== id));
        } else {
            toast.error(res.error || "Delete failed");
        }
    };

    // --- Currency Handlers ---

    const handleCurrencySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const res = await submitCurrency(currencyFormData, editingItem?.id);
        if (res.ok) {
            toast.success("Currency saved successfully");
            setIsCurrencyModalOpen(false);
            window.location.reload();
        } else {
            toast.error(res.error || "Failed to save");
        }
        setIsLoading(false);
    };

    const handleDeleteCurrency = async (id: string) => {
        if (!confirm("Are you sure? This might affect products using this currency.")) return;
        const res = await deleteCurrency(id);
        if (res.ok) {
            toast.success("Currency deleted");
            setCurrencies(currencies.filter(c => c.id !== id));
        } else {
            toast.error(res.error || "Delete failed");
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>
                <p className="text-muted-foreground text-lg">Manage global units and currencies used across all vendors.</p>
            </div>

            <Tabs defaultValue="units" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                    <TabsTrigger value="units" className="flex items-center gap-2">
                        <Scale className="h-4 w-4" /> Type Food (Units)
                    </TabsTrigger>
                    <TabsTrigger value="currency" className="flex items-center gap-2">
                        <Coins className="h-4 w-4" /> Currencies
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="units" className="pt-6">
                    <Card className="border-none shadow-xl bg-white/50 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                            <div>
                                <CardTitle className="text-2xl">Measurement Units</CardTitle>
                                <CardDescription>Define units like KG, Gram, Box, Set, etc.</CardDescription>
                            </div>
                            <Button onClick={() => {
                                setEditingItem(null);
                                setTypeFormData({ title: "", status: "active", sort: "0" });
                                setIsTypeModalOpen(true);
                            }} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                                <Plus className="h-4 w-4 mr-2" /> Add Unit
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent border-gray-100">
                                        <TableHead className="w-[100px]">Sort</TableHead>
                                        <TableHead>Unit Title</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {typeFoods.map((tf) => (
                                        <TableRow key={tf.id} className="group hover:bg-gray-50/50 transition-colors border-gray-50">
                                            <TableCell className="font-medium text-gray-400 group-hover:text-primary transition-colors">{tf.sort}</TableCell>
                                            <TableCell className="font-semibold text-gray-700">{tf.title}</TableCell>
                                            <TableCell>
                                                <Badge variant={tf.status === 'active' ? "success" : "secondary"} className="rounded-full px-3 py-0.5 font-medium">
                                                    {tf.status === 'active' ? (
                                                        <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3" /> Active</span>
                                                    ) : (
                                                        <span className="flex items-center gap-1.5"><XCircle className="h-3 w-3" /> Inactive</span>
                                                    )}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" onClick={() => {
                                                        setEditingItem(tf);
                                                        setTypeFormData({ title: tf.title, status: tf.status, sort: tf.sort.toString() });
                                                        setIsTypeModalOpen(true);
                                                    }} className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteType(tf.id)} className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="currency" className="pt-6">
                    <Card className="border-none shadow-xl bg-white/50 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                            <div>
                                <CardTitle className="text-2xl">Global Currencies</CardTitle>
                                <CardDescription>Manage currency codes and exchange rates.</CardDescription>
                            </div>
                            <Button onClick={() => {
                                setEditingItem(null);
                                setCurrencyFormData({ title: "", symbol: "", exchangeRateToUsd: "1", status: "active" });
                                setIsCurrencyModalOpen(true);
                            }} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                                <Plus className="h-4 w-4 mr-2" /> Add Currency
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent border-gray-100">
                                        <TableHead>Currency</TableHead>
                                        <TableHead>Symbol</TableHead>
                                        <TableHead>Rate (to USD)</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currencies.map((c) => (
                                        <TableRow key={c.id} className="group hover:bg-gray-50/50 transition-colors border-gray-50">
                                            <TableCell className="font-bold text-gray-700">{c.title}</TableCell>
                                            <TableCell className="font-mono text-lg text-primary">{c.symbol}</TableCell>
                                            <TableCell className="text-gray-600">
                                                <span className="font-medium">1 {c.title} = </span>
                                                <span className="bg-gray-100 px-2 py-0.5 rounded text-sm font-mono">{c.exchangeRateToUsd} USD</span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={c.status === 'active' ? "success" : "secondary"} className="rounded-full px-3 py-0.5 font-medium">
                                                    {c.status === 'active' ? (
                                                        <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3" /> Active</span>
                                                    ) : (
                                                        <span className="flex items-center gap-1.5"><XCircle className="h-3 w-3" /> Inactive</span>
                                                    )}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" onClick={() => {
                                                        setEditingItem(c);
                                                        setCurrencyFormData({
                                                            title: c.title,
                                                            symbol: c.symbol || "",
                                                            exchangeRateToUsd: c.exchangeRateToUsd.toString(),
                                                            status: c.status
                                                        });
                                                        setIsCurrencyModalOpen(true);
                                                    }} className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteCurrency(c.id)} className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Type Food Modal */}
            <Dialog open={isTypeModalOpen} onOpenChange={setIsTypeModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">{editingItem ? "Edit Unit" : "Add New Unit"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleTypeSubmit} className="space-y-6 pt-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Unit Title (e.g. KG, Gram, Box)</label>
                                <Input
                                    required
                                    value={typeFormData.title}
                                    onChange={e => setTypeFormData({ ...typeFormData, title: e.target.value })}
                                    className="focus-visible:ring-primary border-gray-200"
                                    placeholder="Enter unit name..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Sort Order</label>
                                    <Input
                                        type="number"
                                        value={typeFormData.sort}
                                        onChange={e => setTypeFormData({ ...typeFormData, sort: e.target.value })}
                                        className="focus-visible:ring-primary border-gray-200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Status</label>
                                    <Select value={typeFormData.status} onValueChange={v => setTypeFormData({ ...typeFormData, status: v })}>
                                        <SelectTrigger className="border-gray-200">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button type="button" variant="outline" onClick={() => setIsTypeModalOpen(false)} className="rounded-full px-6">Cancel</Button>
                            <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 rounded-full px-8 shadow-lg shadow-primary/20">
                                {isLoading ? "Saving..." : <span className="flex items-center gap-2"><Save className="h-4 w-4" /> Save Unit</span>}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Currency Modal */}
            <Dialog open={isCurrencyModalOpen} onOpenChange={setIsCurrencyModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">{editingItem ? "Edit Currency" : "Add New Currency"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCurrencySubmit} className="space-y-6 pt-4">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Code (e.g. USD)</label>
                                    <Input
                                        required
                                        value={currencyFormData.title}
                                        onChange={e => setCurrencyFormData({ ...currencyFormData, title: e.target.value.toUpperCase() })}
                                        className="focus-visible:ring-primary border-gray-200 uppercase font-bold"
                                        placeholder="USD"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Symbol</label>
                                    <Input
                                        value={currencyFormData.symbol}
                                        onChange={e => setCurrencyFormData({ ...currencyFormData, symbol: e.target.value })}
                                        className="focus-visible:ring-primary border-gray-200 text-lg color-primary"
                                        placeholder="$"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Exchange Rate (to 1 USD)</label>
                                <div className="relative">
                                    <Input
                                        type="number"
                                        step="0.000001"
                                        required
                                        value={currencyFormData.exchangeRateToUsd}
                                        onChange={e => setCurrencyFormData({ ...currencyFormData, exchangeRateToUsd: e.target.value })}
                                        className="focus-visible:ring-primary border-gray-200 pl-8"
                                    />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-sm">$</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground italic">Important for price calculations across the store.</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Status</label>
                                <Select value={currencyFormData.status} onValueChange={v => setCurrencyFormData({ ...currencyFormData, status: v })}>
                                    <SelectTrigger className="border-gray-200">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button type="button" variant="outline" onClick={() => setIsCurrencyModalOpen(false)} className="rounded-full px-6">Cancel</Button>
                            <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 rounded-full px-8 shadow-lg shadow-primary/20">
                                {isLoading ? "Saving..." : <span className="flex items-center gap-2"><Save className="h-4 w-4" /> Save Currency</span>}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
