"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
    nameKh: z.string().min(1, "Name KH is required"),
    nameEn: z.string().optional(),
    slug: z.string().min(1, "Slug is required"),
    image: z.string().url().optional().or(z.literal("")),
});

export default function CreateCategoryPage() {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nameKh: "",
            nameEn: "",
            slug: "",
            image: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            await axios.post("/api/categories", values);
            alert("Category Created Successfully!");
            form.reset();
        } catch (error) {
            console.error(error);
            alert("Failed to create category");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="container mx-auto py-10 max-w-xl">
            <h1 className="text-2xl font-bold mb-6">Create New Category</h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="nameKh"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name (KH)</FormLabel>
                                <FormControl>
                                    <Input placeholder="ឈ្មោះ" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="nameEn"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name (EN)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Slug</FormLabel>
                                <FormControl>
                                    <Input placeholder="slug" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Image URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Category
                    </Button>
                </form>
            </Form>
        </div>
    );
}
