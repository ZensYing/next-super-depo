"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { Loader2, Plus, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Schema validating the form
const formSchema = z.object({
    productNameKh: z.string().min(1, "Name KH is required"),
    productNameEn: z.string().optional(),
    slug: z.string().min(1, "Slug is required"),
    description: z.string().optional(),
    categoryId: z.string().min(1, "Category is required"),
    subCategoryId: z.string().optional(),
    stockQuantity: z.coerce.number().int().min(0).default(0),
    unlimitedStock: z.boolean().default(false),
    weight: z.coerce.number().min(0).default(0),
    mainImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    status: z.enum(["published", "draft"]),
    prices: z.array(z.object({
        typeFoodId: z.string().min(1, "Type is required"), // Unit
        price: z.coerce.number().min(0, "Price must be >= 0"),
        currencyId: z.string().min(1, "Currency is required"),
        unitLabel: z.string().optional(),
    })).min(1, "Add at least one price option"),
});

type ProductFormValues = z.infer<typeof formSchema>;

export default function CreateProductPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [typeFoods, setTypeFoods] = useState<any[]>([]);
    const [currencies, setCurrencies] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            productNameKh: "",
            productNameEn: "",
            slug: "",
            description: "",
            categoryId: "", // Initialize with empty string
            stockQuantity: 0,
            unlimitedStock: false,
            weight: 0,
            mainImage: "",
            status: "draft",
            prices: [{ price: 0, currencyId: "", typeFoodId: "", unitLabel: "" }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "prices",
    });

    useEffect(() => {
        // Fetch dependencies
        const fetchData = async () => {
            try {
                const [catRes, typeRes, currRes] = await Promise.all([
                    axios.get("/api/categories"),
                    axios.get("/api/type-food"),
                    axios.get("/api/currencies"),
                ]);
                setCategories(catRes.data);
                setTypeFoods(typeRes.data);
                setCurrencies(currRes.data);
            } catch (err) {
                console.error("Failed to load form data", err);
            }
        };
        fetchData();
    }, []);

    async function onSubmit(values: ProductFormValues) {
        setIsLoading(true);
        try {
            const payload = {
                ...values,
                // vendorId is handled by backend session
            };
            await axios.post("/api/products", payload);
            alert("Product Created Successfully!");
            form.reset();
        } catch (error) {
            console.error(error);
            alert("Failed to create product");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="container mx-auto py-10 max-w-4xl space-y-6">
            <h1 className="text-2xl font-bold">Create New Product</h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="productNameKh"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Name (KH)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="ឈ្មោះផលិតផល" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="productNameEn"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Name (EN)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Product Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Slug (Unique URL)</FormLabel>
                                <FormControl>
                                    <Input placeholder="my-awesome-product" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.nameEn || cat.nameKh}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Price Array Section */}
                    <div className="border p-4 rounded-md space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-lg">Product Pricing Options</h3>
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => append({ price: 0, currencyId: "", typeFoodId: "", unitLabel: "" })}
                            >
                                <Plus className="w-4 h-4 mr-2" /> Add Option
                            </Button>
                        </div>

                        {fields.map((field, index) => (
                            <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end border-b pb-4 mb-4">
                                <FormField
                                    control={form.control}
                                    name={`prices.${index}.typeFoodId`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Unit Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Unit" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {typeFoods.map((t) => (
                                                        <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`prices.${index}.price`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={e => field.onChange(parseFloat(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`prices.${index}.currencyId`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Currency</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="USD/KHR" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {currencies.map((c) => (
                                                        <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => remove(index)}
                                >
                                    <Trash className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                        {form.formState.errors.prices && (
                            <p className="text-red-500 text-sm">{form.formState.errors.prices.message}</p>
                        )}
                    </div>

                    <FormField
                        control={form.control}
                        name="mainImage"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Main Image URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://..." {...field} />
                                </FormControl>
                                <FormDescription>Upload functionality would be integrated here.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Product
                    </Button>
                </form>
            </Form>
        </div>
    );
}
