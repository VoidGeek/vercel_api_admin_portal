const Contact = require("../models/contact.model");

// Create a new contact form submission
const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate the request data
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required fields." });
    }

    // Create a new contact submission
    const newContact = new Contact({
      name,
      email,
      message,
    });

    // Save the contact submission to the database
    await newContact.save();

    return res.status(200).json({ message: "Contact form submitted successfully" });
  } catch (error) {
    console.error("Error creating contact:", error);
    return res.status(500).json({ message: "Error while creating contact" });
  }
};

// Retrieve a list of all contact form submissions
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().exec();
    return res.status(200).json(contacts);
  } catch (error) {
    console.error("Error fetching contact submissions:", error);
    return res.status(500).json({ message: "Error while fetching contact submissions" });
  }
};

// Delete a contact form submission by ID
const deleteContact = async (req, res) => {
  try {
    const contactId = req.params.id;
    const deletedContact = await Contact.findByIdAndDelete(contactId).exec();

    if (!deletedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    return res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return res.status(500).json({ message: "Error while deleting contact" });
  }
};

module.exports = {
  createContact,
  getAllContacts,
  deleteContact,
};
