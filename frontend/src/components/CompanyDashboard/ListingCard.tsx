import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "@/components/StatusBadge";

const ListingCard = ({ listing }) => {
  const navigate = useNavigate();

  return (
    <Card className="p-6 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-3">
            <h3 className="text-lg font-semibold">{listing.title}</h3>
            <StatusBadge status={listing.status} />
          </div>
          <p className="mb-2 text-sm text-muted-foreground">{listing.description}</p>
          <p className="text-xs text-muted-foreground">Category: {listing.category}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate(`/listings/${listing.id}`)}>
          <Eye className="mr-2 h-4 w-4" /> View Details
        </Button>
      </div>
    </Card>
  );
};

export default ListingCard;
