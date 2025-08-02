import residentsData from "@/services/mockData/residents.json";

let residents = [...residentsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const residentService = {
  async getAll() {
    await delay(300);
    return [...residents];
  },

  async getById(id) {
    await delay(200);
    const resident = residents.find(r => r.Id === parseInt(id));
    if (!resident) {
      throw new Error("Resident not found");
    }
    return { ...resident };
  },

  async create(residentData) {
    await delay(400);
    const maxId = Math.max(...residents.map(r => r.Id), 0);
    const newResident = {
      Id: maxId + 1,
      ...residentData,
      createdAt: new Date().toISOString()
    };
    residents.push(newResident);
    return { ...newResident };
  },

  async update(id, residentData) {
    await delay(350);
    const index = residents.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Resident not found");
    }
    residents[index] = {
      ...residents[index],
      ...residentData,
      updatedAt: new Date().toISOString()
    };
    return { ...residents[index] };
  },

  async delete(id) {
    await delay(250);
    const index = residents.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Resident not found");
    }
    const deleted = residents.splice(index, 1)[0];
    return { ...deleted };
  },

  async search(query) {
    await delay(200);
    const searchTerm = query.toLowerCase();
    return residents.filter(resident => 
      resident.name.toLowerCase().includes(searchTerm) ||
      resident.houseNumber.toLowerCase().includes(searchTerm) ||
      resident.occupation.toLowerCase().includes(searchTerm) ||
      resident.familyId.toLowerCase().includes(searchTerm)
    );
  },

  async getByFamily(familyId) {
    await delay(200);
    return residents.filter(resident => resident.familyId === familyId);
  }
};