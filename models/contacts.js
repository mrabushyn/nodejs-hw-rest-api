const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid"); // v4 won't work in CommonJS

const contactsDBPath = path.resolve(__dirname, "contacts.json");

async function readDb() {
    const contactsDBRaw = await fs.readFile(contactsDBPath);
    const contactsDB = JSON.parse(contactsDBRaw);
    return contactsDB;
}

async function writeDB(contactsDB) {
    await fs.writeFile(contactsDBPath, JSON.stringify(contactsDB, null, 2));
}

const listContacts = async () => {
    const contactsDB = await readDb();
    return contactsDB.slice();
};

const getById = async (contactId) => {
    const contactsDB = await readDb();
    const contact = contactsDB.find((contact) => contact.id === contactId);
    return contact || null;
};

const addContact = async (name, email, phone) => {
    const id = nanoid();
    const contact = { id, name, email, phone };
    const contactsDB = await readDb();
    contactsDB.push(contact);
    await writeDB(contactsDB);
    return contact;
};

const removeContact = async (contactId) => {};

const updateContact = async (contactId, body) => {};

module.exports = {
    listContacts,
    getById,
    removeContact,
    addContact,
    updateContact,
};
