import familiesData from "@/services/mockData/families.json";

let families = [...familiesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const familyService = {
  async getAll() {
    await delay(300);
    return [...families];
  },

  async getById(id) {
    await delay(200);
    const family = families.find(f => f.Id === parseInt(id));
    if (!family) {
      throw new Error("Family not found");
    }
    return { ...family };
  },

  async create(familyData) {
    await delay(400);
    const maxId = Math.max(...families.map(f => f.Id), 0);
    const familyIdNumber = maxId + 1;
    const newFamily = {
      Id: familyIdNumber,
      familyId: `FAM-${familyIdNumber.toString().padStart(3, '0')}`,
      ...familyData,
      createdAt: new Date().toISOString()
    };
    families.push(newFamily);
    return { ...newFamily };
  },

  async update(id, familyData) {
    await delay(350);
    const index = families.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Family not found");
    }
    families[index] = {
      ...families[index],
      ...familyData,
      updatedAt: new Date().toISOString()
    };
    return { ...families[index] };
  },

  async delete(id) {
    await delay(250);
    const index = families.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Family not found");
    }
    const deleted = families.splice(index, 1)[0];
    return { ...deleted };
  },

  async search(query) {
    await delay(200);
    const searchTerm = query.toLowerCase();
    return families.filter(family => 
      family.familyName.toLowerCase().includes(searchTerm) ||
      family.familyId.toLowerCase().includes(searchTerm) ||
      family.ward.toLowerCase().includes(searchTerm) ||
      family.street.toLowerCase().includes(searchTerm)
    );
  }
};