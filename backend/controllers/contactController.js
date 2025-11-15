import Contact from "../models/Contact.js";
import sendEmail from "../services/emailService.js";

// 🟩 Create contact message
export const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newContact = await Contact.create({ name, email, subject, message });

    // Optional: Send admin notification email
    try {
      await sendEmail(
        process.env.ADMIN_EMAIL,
        `📩 New Contact Message: ${subject}`,
        `You have a new message from ${name} (${email}):\n\n${message}`
      );
    } catch (error) {
      console.error("Failed to send admin email:", error);
    }

    res.status(201).json({
      success: true,
      message: "Message received successfully!",
      contact: newContact,
    });
  } catch (error) {
    console.error("Contact submission error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟩 Get all contact messages (for admin)
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, contacts });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// 🟩 Delete contact message (for admin)
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Contact.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ success: false, message: "Message not found" });

    res.json({ success: true, message: "Message deleted" });
  } catch (error) {
    console.error("❌ Delete contact error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🟩 Update contact status (for admin)
export const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["new", "read", "replied"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const updated = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Contact not found" });
    }

    res.json({ success: true, message: "Status updated", contact: updated });
  } catch (error) {
    console.error("❌ Update status error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
