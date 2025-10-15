import API from "../api/API";

// Company creates a listing with files (PDF + images)
export const createListing = async (listingData) => {
  const formData = new FormData();

  // Text fields
  formData.append("companyId", listingData.companyId);
  formData.append("companyName", listingData.companyName);
  formData.append("title", listingData.title);
  formData.append("description", listingData.description);
  formData.append("category", listingData.category);
  formData.append("location", listingData.location);
  formData.append("website", listingData.website);

  // Key Features as JSON
  formData.append("keyFeatures", JSON.stringify(listingData.keyFeatures));

  // Attach files
  listingData.verificationDocuments?.forEach((file) => {
    formData.append("verificationDocuments", file);
  });

  listingData.attachments?.forEach((file) => {
    formData.append("attachments", file);
  });

  const res = await API.post("/listings", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// Company gets its own listings
export const getMyListings = async () => {
  const res = await API.get("/listings/my");
  return res.data;
};

// Public approved listings
export const getApprovedListings = async () => {
  const res = await API.get("/listings/approved");
  return res.data;
};

// Admin gets all listings
export const getAllListings = async () => {
  const res = await API.get("/listings");
  return res.data;
};

// Admin updates listing status
export const updateListingStatus = async (id, status, comment = "") => {
  const res = await API.put(`/listings/${id}/status`, { status, comment });
  return res.data;
};
