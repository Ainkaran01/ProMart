import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "@/components/StatusBadge";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import EditListingModal from "@/components/CompanyDashboard/EditListingModal";

const ListingCard = ({ listing, onUpdated }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [editOpen, setEditOpen] = useState(false);

  const handleView = () => {
    if (listing.status !== "approved") {
      toast({
        title: "Access Restricted",
        description:
          listing.status === "pending"
            ? "This listing is still under review. You can view it once it's approved."
            : "This listing was rejected and cannot be viewed.",
        variant: "destructive",
      });
      return;
    }

    navigate(`/listings/${listing._id}`);
  };

  const handleUpdated = () => {
    onUpdated?.();
    toast({ title: "Listing updated successfully!" });
  };

  return (
    <>
      <Card className="p-6 transition-shadow hover:shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-3">
              <h3 className="text-lg font-semibold">{listing.title}</h3>
              <StatusBadge status={listing.status} />
            </div>
            <p className="mb-2 text-sm text-muted-foreground">
              {listing.description}
            </p>
            <p className="text-xs text-muted-foreground">
              Category: {listing.category}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Button variant="outline" size="sm" onClick={handleView}>
              <Eye className="mr-2 h-4 w-4" /> View Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditOpen(true)}
            >
              <Edit className="mr-2 h-4 w-4" /> Edit Details
            </Button>
          </div>
        </div>
      </Card>

      <EditListingModal
        open={editOpen}
        onOpenChange={setEditOpen}
        listing={listing}
        onUpdated={handleUpdated}
      />
    </>
  );
};

export default ListingCard;
