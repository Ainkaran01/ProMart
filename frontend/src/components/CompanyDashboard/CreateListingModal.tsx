import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, File, Image as ImageIcon, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import mockApi from "@/services/mockApi";
import { useAuth } from "@/contexts/AuthContext";

interface CreateListingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

const CreateListingModal = ({
  open,
  onOpenChange,
  onCreated,
}: CreateListingModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    keyFeatures: [] as string[],
  });
  const [featureInput, setFeatureInput] = useState("");
  const [verificationDocs, setVerificationDocs] = useState<File[]>([]);
  const [companyImages, setCompanyImages] = useState<File[]>([]);

  // ➕ Add Key Feature
  const addFeature = () => {
    if (featureInput.trim() === "") return;
    setFormData((prev) => ({
      ...prev,
      keyFeatures: [...prev.keyFeatures, featureInput.trim()],
    }));
    setFeatureInput("");
  };

  // Handle Enter key for features
  const handleFeatureKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFeature();
    }
  };

  // ❌ Remove Key Feature
  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      keyFeatures: prev.keyFeatures.filter((_, i) => i !== index),
    }));
  };

  // 📂 File upload handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setVerificationDocs((prev) => [...prev, ...files]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setCompanyImages((prev) => [...prev, ...files]);
  };

  const removeDocument = (index: number) => {
    setVerificationDocs((prev) => prev.filter((_, i) => i !== index));
  };

  const removeImage = (index: number) => {
    setCompanyImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Reset form when modal closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset form when closing
      setFormData({
        title: "",
        description: "",
        category: "",
        keyFeatures: [],
      });
      setFeatureInput("");
      setVerificationDocs([]);
      setCompanyImages([]);
    }
    onOpenChange(open);
  };

  // ✅ Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const uploadedDocs = verificationDocs.map((file, index) => ({
        id: "doc-" + Date.now() + "-" + index,
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      }));

      const uploadedImages = companyImages.map((file, index) => ({
        id: "img-" + Date.now() + "-" + index,
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      }));

      await mockApi.createListing({
        companyId: user.id,
        companyName: user.companyName!,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        keyFeatures: formData.keyFeatures,
        verificationDocuments: uploadedDocs,
        attachments: uploadedImages.map((img) => img.url),
      });

      toast({
        title: "Listing created!",
        description: "Your listing is pending admin approval.",
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        keyFeatures: [],
      });
      setVerificationDocs([]);
      setCompanyImages([]);
      onOpenChange(false);
      onCreated();
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to create listing",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-4">
        <DialogHeader className="px-1 sm:px-0">
          <DialogTitle className="text-lg sm:text-xl">Create New Listing</DialogTitle>
        </DialogHeader>

        {/* ✅ Responsive Grid Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 px-1 sm:px-0"
        >
          {/* 🏷️ Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm sm:text-base">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              placeholder="Enter listing title"
              className="text-sm sm:text-base"
            />
          </div>

          {/* 🗂️ Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm sm:text-base">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              required
              placeholder="e.g., Software, Consulting, Manufacturing"
              className="text-sm sm:text-base"
            />
          </div>

          {/* 📝 Description */}
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="description" className="text-sm sm:text-base">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              placeholder="Describe your service or product"
              rows={4}
              className="text-sm sm:text-base resize-vertical min-h-[100px]"
            />
          </div>

          {/* 🌟 Key Features */}
          <div className="md:col-span-2 space-y-3">
            <Label htmlFor="keyFeatures" className="text-sm sm:text-base block">
              Key Features
            </Label>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Highlight what makes your company stand out (e.g., "Fast Delivery", "Certified Experts")
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <Input
                id="keyFeatures"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyPress={handleFeatureKeyPress}
                placeholder="Enter a feature"
                className="flex-1 text-sm sm:text-base"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={addFeature}
                className="sm:w-auto flex items-center justify-center gap-1 py-2"
              >
                <Plus className="h-4 w-4" />
                <span className="text-sm sm:text-base">Add</span>
              </Button>
            </div>

            {formData.keyFeatures.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.keyFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs sm:text-sm text-amber-800 max-w-full"
                  >
                    <span className="truncate max-w-[120px] sm:max-w-none">{feature}</span>
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="flex-shrink-0 text-amber-600 hover:text-amber-800"
                      aria-label={`Remove ${feature}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 📁 Documents & Images — Responsive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:col-span-2">
            {/* 📑 Verification Documents */}
            <div className="space-y-3">
              <div>
                <Label htmlFor="verificationDocs" className="text-sm sm:text-base block">
                  Verification Documents *
                </Label>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Upload business license, certificates, or other verification documents
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Input
                    id="verificationDocs"
                    type="file"
                    onChange={handleFileUpload}
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="hidden"
                  />
                  <Label
                    htmlFor="verificationDocs"
                    className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/50 p-3 sm:p-4 transition-colors hover:border-primary hover:bg-muted text-center"
                  >
                    <Upload className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-xs sm:text-sm font-medium">Choose Files</span>
                  </Label>
                </div>

                {verificationDocs.length > 0 && (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {verificationDocs.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border bg-muted/30 p-2 sm:p-3"
                      >
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <File className="h-4 w-4 text-primary flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument(index)}
                          className="flex-shrink-0 ml-2"
                        >
                          <X className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 🖼️ Company Images */}
            <div className="space-y-3">
              <div>
                <Label htmlFor="companyImages" className="text-sm sm:text-base block">
                  Company Images
                </Label>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Upload company photos, logos, or marketing images for your listing
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Input
                    id="companyImages"
                    type="file"
                    onChange={handleImageUpload}
                    multiple
                    accept="image/*"
                    className="hidden"
                  />
                  <Label
                    htmlFor="companyImages"
                    className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/50 p-3 sm:p-4 transition-colors hover:border-primary hover:bg-muted text-center"
                  >
                    <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-xs sm:text-sm font-medium">Upload Images</span>
                  </Label>
                </div>

                {companyImages.length > 0 && (
                  <div className="grid grid-cols-2 xs:grid-cols-3 gap-2 sm:gap-3 max-h-40 overflow-y-auto">
                    {companyImages.map((file, index) => (
                      <div
                        key={index}
                        className="relative rounded-lg border overflow-hidden aspect-square"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                          aria-label={`Remove ${file.name}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ✅ Submit / Cancel */}
          <div className="md:col-span-2 flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="flex-1 order-2 sm:order-1 py-2 sm:py-2"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || verificationDocs.length === 0}
              className="flex-1 order-1 sm:order-2 py-2 sm:py-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Creating...
                </span>
              ) : (
                "Submit for Approval"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateListingModal;