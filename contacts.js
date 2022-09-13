const fs = require("fs").promises;
const path = require("path");
const colors = require("colors");

const contactsPath = path.resolve("./db/contacts.json");

const SHOW_TABLE = true;
const HIDE_TABLE = false;

const getContacts = async (view = SHOW_TABLE) => {
  const contacts = await fs.readFile(contactsPath, "utf-8");
  const parsedContacts = JSON.parse(contacts);

  if (view) {
    console.table(parsedContacts);
  }

  return parsedContacts;
};

const getContactById = async (contactId) => {
  const contacts = await getContacts(HIDE_TABLE);
  const contact = contacts.find((item) => item.id === contactId);

  if (!contact) {
    console.log(
      `\nSorry, there is no contact with id: ${contactId}. Check and try again!`
        .red
    );
    return;
  }

  console.log(`\nHere is the contact you looked for:\n`.cyan);
  console.table(contact);
  return contact;
};

const addContact = async (name, email, phone) => {
  const contacts = await getContacts(HIDE_TABLE);
  const id = (Number(contacts[contacts.length - 1].id) + 1).toString();
  const newContact = { id, name, email, phone };
  const updatedContacts = [...contacts, newContact];
  const jsonContacts = JSON.stringify(updatedContacts);

  await fs.writeFile(contactsPath, jsonContacts);
  await getContacts();
  console.log(`\nSuccess! "${name}" has been added to Contacts!`.cyan);

  return newContact;
};

const removeContact = async (contactId) => {
  const contacts = await getContacts(HIDE_TABLE);
  const contactToRemove = contacts.find((item) => item.id === contactId);

  if (!contactToRemove) {
    console.log(
      `\nSorry, there is no contact with id: ${contactId}. Check and try again!`
        .red
    );
    return;
  }

  const updatedContacts = contacts.filter((item) => item.id !== contactId);
  const jsonContacts = JSON.stringify(updatedContacts);

  await fs.writeFile(contactsPath, jsonContacts);
  await getContacts();
  console.log(
    `\nSuccess! Contact "${contactToRemove.name}" with id "${contactToRemove.id}" has been removed`
      .cyan
  );

  return contactToRemove ? contactToRemove : null;
};

module.exports = {
  getContacts,
  getContactById,
  addContact,
  removeContact,
};
