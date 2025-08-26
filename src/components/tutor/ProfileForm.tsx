"use client";

import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";


const baseSchema = z.object({
  // Step 1
  name: z.string().min(1, "Name is required"),
  subject: z.string().min(1, "Subject is required"),
  gender: z.enum(["male", "female"]),
  mode: z.enum(["online", "home", "institute"]),
  experience: z.number().min(0, "Experience must be >= 0"),
  bio: z.string().optional(),
  contact: z.string().min(10, "Valid contact number required"),
  // Step 2
  education: z.object({
    highestDegree: z.string().min(1, "Required"),
    field: z.string().min(1, "Required"),
    institute: z.string().min(1, "Required"),
    graduationYear: z
      .number()
      .int()
      .min(1950)
      .max(new Date().getFullYear())
      .optional(),
  }),
  // Step 3
  address: z.object({
    city: z.string().min(1, "Required"),
    area: z.string().min(1, "Required"),
    addressLine: z.string().min(1, "Required"),
    postalCode: z.string().optional(),
  }),
});

type FormData = z.infer<typeof baseSchema>;

export default function ProfileForm({
  onSave,
  initialData,
}: {
  onSave: () => void;
  initialData: FormData | null;
}) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [photo, setPhoto] = useState<File | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(baseSchema),
    defaultValues: initialData || {
      name: "",
      subject: "",
      gender: "male",
      mode: "online",
      experience: 0,
      bio: "",
      contact: "",
      education: {
        highestDegree: "",
        field: "",
        institute: "",
        graduationYear: undefined,
      },
      address: { city: "", area: "", addressLine: "", postalCode: "" },
    },
  });

  useEffect(() => {
    if (initialData) {
      // ensure nested defaults exist
      form.reset({
        ...initialData,
        education: initialData.education || {
          highestDegree: "",
          field: "",
          institute: "",
          graduationYear: undefined,
        },
        address: initialData.address || {
          city: "",
          area: "",
          addressLine: "",
          postalCode: "",
        },
      });
    }
  }, [initialData, form]);

  const next = async () => {
    const sectionFields =
      step === 1
        ? ["name", "subject", "gender", "mode", "experience", "bio", "contact"]
        : step === 2
          ? [
              "education.highestDegree",
              "education.field",
              "education.institute",
              "education.graduationYear",
            ]
          : [
              "address.city",
              "address.area",
              "address.addressLine",
              "address.postalCode",
            ];

    const isValid = await form.trigger(sectionFields as (keyof FormData)[], {
      shouldFocus: true,
    });

    if (isValid) setStep((s) => (s === 3 ? 3 : ((s + 1) as 1 | 2 | 3)));
  };

  const prev = () => setStep((s) => (s === 1 ? 1 : ((s - 1) as 1 | 2 | 3)));

  const handleSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      let photoAssetId = null;

      if (photo) {
        const formData = new FormData();
        formData.append("file", photo);

        const uploadRes = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        });

        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok)
          throw new Error(uploadJson.error || "Image upload failed");

        photoAssetId = uploadJson.assetId;
      }

      const res = await fetch("/api/save-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          name: data.name,
          subject: data.subject,
          gender: data.gender,
          mode: data.mode,
          experience: data.experience,
          bio: data.bio,
          contact: data.contact,
          education: data.education,
          address: data.address,
          photo: photoAssetId, // ✅
        }),
      });

      if (!res.ok)
        throw new Error((await res.json()).error || "Failed to save profile");
      alert("✅ Profile saved!");
      onSave();
    } catch (e: unknown) {
      if (e instanceof Error) {
        alert(e.message);
      } else {
        alert("Failed to save profile");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>
          {initialData ? "Edit Your Profile" : "Create Your Profile"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Stepper */}
          <div className="flex items-center justify-between mb-2">
            {["Tutor Info", "Education", "Address"].map((label, i) => {
              const index = (i + 1) as 1 | 2 | 3;
              return (
                <div key={label} className="flex-1 flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= index ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"}`}
                  >
                    {index}
                  </div>
                  <span className="ml-2 text-sm">{label}</span>
                  {index < 3 && (
                    <div
                      className={`flex-1 h-px mx-3 ${step > index ? "bg-indigo-600" : "bg-gray-200"}`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step 1: Tutor Info */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block font-medium mb-1">Profile Image</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Full Name</label>
                <Input
                  {...form.register("name")}
                  placeholder="Enter your full name"
                />
                <p className="text-red-500 text-sm">
                  {form.formState.errors.name?.message}
                </p>
              </div>
              <div>
                <label className="block font-medium mb-1">Subject</label>
                <Input
                  {...form.register("subject")}
                  placeholder="e.g. Math, Physics"
                />
                <p className="text-red-500 text-sm">
                  {form.formState.errors.subject?.message}
                </p>
              </div>
              <div>
                <label className="block font-medium mb-1">Gender</label>
                <Select
                  onValueChange={(val) =>
                    form.setValue("gender", val as "male" | "female")
                  }
                  defaultValue={form.watch("gender")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block font-medium mb-1">
                  Mode of Teaching
                </label>
                <Select
                  onValueChange={(val) =>
                    form.setValue(
                      "mode",
                      val as "online" | "home" | "institute"
                    )
                  }
                  defaultValue={form.watch("mode")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="institute">Institute</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block font-medium mb-1">
                  Experience (years)
                </label>
                <Input
                  type="number"
                  {...form.register("experience", { valueAsNumber: true })}
                  placeholder="e.g. 2"
                />
                <p className="text-red-500 text-sm">
                  {form.formState.errors.experience?.message}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block font-medium mb-1">Short Bio</label>
                <Textarea
                  {...form.register("bio")}
                  placeholder="Tell students about yourself"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-medium mb-1">
                  Contact (Phone/WhatsApp)
                </label>
                <Input
                  {...form.register("contact")}
                  placeholder="e.g. 0315xxxxxxx"
                />
                <p className="text-red-500 text-sm">
                  {form.formState.errors.contact?.message}
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Education */}
          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Highest Degree</label>
                <Input
                  {...form.register("education.highestDegree")}
                  placeholder="e.g. BS, MSc, MPhil"
                />
                <p className="text-red-500 text-sm">
                  {form.formState.errors.education?.highestDegree?.message}
                </p>
              </div>
              <div>
                <label className="block font-medium mb-1">Field of Study</label>
                <Input
                  {...form.register("education.field")}
                  placeholder="e.g. Mathematics"
                />
                <p className="text-red-500 text-sm">
                  {form.formState.errors.education?.field?.message}
                </p>
              </div>
              <div>
                <label className="block font-medium mb-1">
                  Institute/University
                </label>
                <Input
                  {...form.register("education.institute")}
                  placeholder="e.g. KU"
                />
                <p className="text-red-500 text-sm">
                  {form.formState.errors.education?.institute?.message}
                </p>
              </div>
              <div>
                <label className="block font-medium mb-1">
                  Graduation Year
                </label>
                <Input
                  type="number"
                  {...form.register("education.graduationYear", {
                    valueAsNumber: true,
                  })}
                  placeholder="e.g. 2023"
                />
              </div>
            </div>
          )}

          {/* Step 3: Address */}
          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">City</label>
                <Input
                  {...form.register("address.city")}
                  placeholder="e.g. Karachi"
                />
                <p className="text-red-500 text-sm">
                  {form.formState.errors.address?.city?.message}
                </p>
              </div>
              <div>
                <label className="block font-medium mb-1">Area/Locality</label>
                <Input
                  {...form.register("address.area")}
                  placeholder="e.g. Nazimabad"
                />
                <p className="text-red-500 text-sm">
                  {form.formState.errors.address?.area?.message}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block font-medium mb-1">Full Address</label>
                <Input
                  {...form.register("address.addressLine")}
                  placeholder="House#, Street, ..."
                />
                <p className="text-red-500 text-sm">
                  {form.formState.errors.address?.addressLine?.message}
                </p>
              </div>
              <div>
                <label className="block font-medium mb-1">Postal Code</label>
                <Input
                  {...form.register("address.postalCode")}
                  placeholder="e.g. 74600"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={prev}
              disabled={step === 1}
            >
              Back
            </Button>
            {step < 3 ? (
              <Button type="button" onClick={next}>
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 text-white hover:bg-indigo-700"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Save Profile"
                )}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
