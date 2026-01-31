"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createDepo } from "@/app/[lang]/super-admin-depo/depos/actions";
import { toast } from "sonner";
import { Loader2, PlusCircle } from "lucide-react";

export default function DepoSetupDialog({
    open,
    onOpenChange,
    onSuccess
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: (newDepo: any) => void;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        vendorName: "",
        vendorSlug: "",
        contactPhone: "",
        description: "",
        address: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.vendorName || !formData.vendorSlug) {
            toast.error("Name and Slug are required");
            return;
        }

        try {
            setIsLoading(true);
            const res = await createDepo(formData);
            if (res.ok) {
                toast.success("Depo created successfully");
                onSuccess?.(res.data);
                onOpenChange(false);
                setFormData({
                    vendorName: "",
                    vendorSlug: "",
                    contactPhone: "",
                    description: "",
                    address: ""
                });
            } else {
                toast.error(res.error || "Failed to create depo");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const handleNameChange = (name: string) => {
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        setFormData({ ...formData, vendorName: name, vendorSlug: slug });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Set up your Depo</DialogTitle>
                    <DialogDescription>
                        Create a store/depo to manage your products. You can create multiple depos for different locations or categories.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Depo Name *</Label>
                        <Input
                            placeholder="e.g. My Central Store"
                            value={formData.vendorName}
                            onChange={e => handleNameChange(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Slug (URL) *</Label>
                        <Input
                            placeholder="my-central-store"
                            value={formData.vendorSlug}
                            onChange={e => setFormData({ ...formData, vendorSlug: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Contact Phone</Label>
                        <Input
                            placeholder="012 345 678"
                            value={formData.contactPhone}
                            onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Short Description</Label>
                        <Textarea
                            placeholder="Briefly describe this depo..."
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                </form>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                        Create Depo
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
