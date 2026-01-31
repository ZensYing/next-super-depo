"use client";

import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
    User,
    Mail,
    Phone,
    Store,
    MapPin,
    Link as LinkIcon,
    Image as ImageIcon,
    ChevronRight,
    ChevronLeft,
    CheckCircle2,
    ShieldCheck,
    Lock,
    Briefcase,
    Eye,
    EyeOff
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Image from "next/image";
import { api } from "@/lib/api";

export const VendorRegister = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const { getLocalizedPath } = useLanguage();
    const { login } = useAuth();

    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        gender: "",
        email: "",
        phone: "",
        storeName: "",
        address: "",
        locationLink: "",
        category: "",
        password: "",
        confirmPassword: "",
    });

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [licenseFile, setLicenseFile] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'license') => {
        if (e.target.files && e.target.files[0]) {
            if (type === 'logo') setLogoFile(e.target.files[0]);
            else setLicenseFile(e.target.files[0]);
        }
    };

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const uploadFile = async (file: File, type: 'logo' | 'license') => {
        const form = new FormData();
        form.append('file', file);
        const response = await api.post(`/uploads/${type}`, form, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data.url;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Error", { description: "Passwords do not match!" });
            return;
        }

        setIsLoading(true);
        try {
            let logoUrl = "";
            let licenseUrl = "";

            if (logoFile) {
                logoUrl = await uploadFile(logoFile, 'logo');
            }
            if (licenseFile) {
                licenseUrl = await uploadFile(licenseFile, 'license');
            }

            const response = await api.post('/vendors/register', {
                ...formData,
                logo: logoUrl,
                businessLicense: licenseUrl,
            });

            // Auto Login
            if (response.data.access_token && response.data.user) {
                login(response.data.access_token, response.data.user);
                toast.success("Application Submitted!", {
                    description: "You are now logged in. Our team will review your application soon.",
                });
                router.push(getLocalizedPath("/vendor/dashboard"));
            } else {
                toast.success("Application Submitted!", {
                    description: "Our team will review your vendor application within 24 hours.",
                });
                router.push(getLocalizedPath("/login"));
            }
        } catch (error: any) {
            const message = error.response?.data?.message || "Something went wrong. Please try again.";
            toast.error("Registration Failed", { description: message });
        } finally {
            setIsLoading(false);
        }
    };

    const renderStepIndicator = () => (
        <div className="flex items-center justify-between mb-8 max-w-sm mx-auto">
            {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                    <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                        ${step === s ? 'border-primary bg-primary text-white scale-110 shadow-lg' :
                            step > s ? 'border-green-500 bg-green-500 text-white' :
                                'border-muted bg-background text-muted-foreground'}
                    `}>
                        {step > s ? <CheckCircle2 className="h-6 w-6" /> : <span>{s}</span>}
                    </div>
                    {s < 3 && (
                        <div className={`w-12 h-1 mx-2 rounded ${step > s ? 'bg-green-500' : 'bg-muted'}`} />
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />
            <main className="flex-1 flex flex-col lg:flex-row">
                {/* Left Side: Illustration & Branding */}
                <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative items-center justify-center p-12 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent z-10" />
                    <Image
                        src="/images/vendor-onboarding.png"
                        alt="Vendor Onboarding"
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                    <div className="relative z-20 text-white max-w-lg">
                        <h1 className="text-5xl font-bold mb-6">Grow Your Business with KhGlobal</h1>
                        <p className="text-xl text-slate-300 leading-relaxed mb-8">
                            Join Cambodia's leading marketplace for construction and home materials. Reach thousands of customers instantly.
                        </p>
                        <div className="space-y-4">
                            {[
                                "Zero hidden fees for the first 3 months",
                                "Manage orders with a powerful vendor portal",
                                "Instant payouts and transparent reporting"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <CheckCircle2 className="h-6 w-6 text-primary" />
                                    <span className="text-lg">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12">
                    <div className="w-full max-w-xl space-y-8 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-slate-900">Partner with Us</h2>
                            <p className="text-slate-500 mt-2">Finish your registration in 3 simple steps</p>
                        </div>

                        {renderStepIndicator()}

                        <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
                            {/* Step 1: Personal Info */}
                            {step === 1 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input id="firstName" placeholder="John" className="pl-9" required value={formData.firstName} onChange={handleChange} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input id="lastName" placeholder="Doe" className="pl-9" required value={formData.lastName} onChange={handleChange} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="gender">Gender</Label>
                                        <select
                                            id="gender"
                                            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            required
                                            value={formData.gender}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input id="email" type="email" placeholder="john@example.com" className="pl-9" required value={formData.email} onChange={handleChange} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Password</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    className="pl-9 pr-9"
                                                    required
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                                >
                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="confirmPassword"
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    className="pl-9 pr-9"
                                                    required
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                                >
                                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input id="phone" type="tel" placeholder="012 345 678" className="pl-9" required value={formData.phone} onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Store Setup */}
                            {step === 2 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="space-y-2">
                                        <Label htmlFor="storeName">Store Name</Label>
                                        <div className="relative">
                                            <Store className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input id="storeName" placeholder="Elite Construction Materials" className="pl-9" required value={formData.storeName} onChange={handleChange} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="logo">Store Logo</Label>
                                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted rounded-lg p-6 hover:border-primary/50 transition-colors">
                                            <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                                            <p className="text-xs text-muted-foreground">{logoFile ? `Selected: ${logoFile.name}` : 'Click or drag your logo here'}</p>
                                            <input type="file" className="hidden" id="logo" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} />
                                            <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => document.getElementById('logo')?.click()}>
                                                {logoFile ? 'Change Logo' : 'Choose File'}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address">Store Address</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input id="address" placeholder="Russian Blvd, Phnom Penh" className="pl-9" required value={formData.address} onChange={handleChange} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="location">Google Maps Link</Label>
                                        <div className="relative">
                                            <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input id="locationLink" placeholder="https://maps.google.com/..." className="pl-9" value={formData.locationLink} onChange={handleChange} />
                                        </div>
                                        <p className="text-[10px] text-muted-foreground">Tip: We'll try to auto-detect your location if left empty</p>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Verification & Security (Recommended) */}
                            {step === 3 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Business Category</Label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <select
                                                id="category"
                                                className="w-full h-10 pl-9 pr-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                required
                                                value={formData.category}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select Category</option>
                                                <option value="materials">Raw Materials</option>
                                                <option value="tools">Construction Tools</option>
                                                <option value="interior">Interior Design</option>
                                                <option value="lighting">Lighting & Electrical</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="businessLicense">Business License / ID</Label>
                                        <div className="flex items-center gap-4 p-4 border rounded-lg bg-slate-50">
                                            <div className="bg-primary/10 p-3 rounded-full">
                                                <ShieldCheck className="h-6 w-6 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">Verify your business</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {licenseFile ? `Selected: ${licenseFile.name}` : 'Upload your legal document'}
                                                </p>
                                            </div>
                                            <input type="file" className="hidden" id="license" onChange={(e) => handleFileChange(e, 'license')} />
                                            <Button type="button" variant="ghost" size="sm" onClick={() => document.getElementById('license')?.click()}>
                                                {licenseFile ? 'Change' : 'Upload'}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-2 pt-4">
                                        <input type="checkbox" id="terms" className="mt-1" required />
                                        <Label htmlFor="terms" className="text-xs text-slate-500 leading-tight">
                                            I agree to the KhGlobal Vendor Agreement and confirm that all provided information is accurate.
                                        </Label>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-4 pt-6">
                                {step > 1 && (
                                    <Button type="button" variant="outline" className="flex-1" onClick={handleBack} disabled={isLoading}>
                                        <ChevronLeft className="mr-2 h-4 w-4" /> Back
                                    </Button>
                                )}
                                <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20" disabled={isLoading}>
                                    {isLoading ? (
                                        "Processing..."
                                    ) : step === 3 ? (
                                        "Submit Application"
                                    ) : (
                                        <>Next Step <ChevronRight className="ml-2 h-4 w-4" /></>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>

                    <div className="mt-8 text-center text-sm text-slate-500">
                        Already have a vendor account? {" "}
                        <button onClick={() => router.push(getLocalizedPath("/login"))} className="text-primary font-semibold hover:underline">
                            Log in here
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};
