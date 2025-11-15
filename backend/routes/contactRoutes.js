import express from "express";
import {
  createContact,
  getContacts,
  deleteContact,
  updateContactStatus,
} from "../controllers/contactController.js";

const router = express.Router();

router.post("/", createContact);         // user submits
router.get("/", getContacts);            // admin fetch
router.delete("/:id", deleteContact);    // admin delete
router.patch("/:id", updateContactStatus); // ✅ admin update status

export default router;
