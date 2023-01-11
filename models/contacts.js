const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsDBPath = path.resolve(__dirname, "contacts.json");

async function readDb() {
    const contactsDBRaw = await fs.readFile(contactsDBPath);
    const contactsDB = JSON.parse(contactsDBRaw);
    return contactsDB;
}

async function writeDB(contactsDB) {
    await fs.writeFile(contactsDBPath, JSON.stringify(contactsDB, null, 2));
}

const listContacts = async ({ limit = 0 }) => {
    const contactsDB = await readDb();
    return contactsDB.slice(-limit);
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

const removeContact = async (contactId) => {
    const contactsDB = await readDb();
    const updatedDb = contactsDB.filter((contact) => contact.id !== contactId);
    await writeDB(updatedDb);
};

const updateContact = async (contact) => {
    const contactsDB = await readDb();
    const updatedDb = contactsDB.filter((item) => item.id !== contact.id);
    updatedDb.push(contact);
    await writeDB(updatedDb);
};

module.exports = {
    listContacts,
    getById,
    removeContact,
    addContact,
    updateContact,
};
