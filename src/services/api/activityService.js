import activitiesData from "@/services/mockData/activities.json";

let activities = [...activitiesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const activityService = {
  async getAll() {
    await delay(300);
    return [...activities];
  },

  async getById(id) {
    await delay(200);
    const activity = activities.find(a => a.Id === parseInt(id));
    if (!activity) {
      throw new Error("Activity not found");
    }
    return { ...activity };
  },

  async create(activityData) {
    await delay(400);
    const maxId = Math.max(...activities.map(a => a.Id), 0);
    const newActivity = {
      Id: maxId + 1,
      ...activityData,
      attendeeIds: [],
      status: "Upcoming",
      createdAt: new Date().toISOString()
    };
    activities.push(newActivity);
    return { ...newActivity };
  },

  async update(id, activityData) {
    await delay(350);
    const index = activities.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Activity not found");
    }
    activities[index] = {
      ...activities[index],
      ...activityData,
      updatedAt: new Date().toISOString()
    };
    return { ...activities[index] };
  },

  async delete(id) {
    await delay(250);
    const index = activities.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Activity not found");
    }
    const deleted = activities.splice(index, 1)[0];
    return { ...deleted };
  },

  async addAttendee(id, residentId) {
    await delay(200);
    const index = activities.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Activity not found");
    }
    if (!activities[index].attendeeIds.includes(parseInt(residentId))) {
      activities[index].attendeeIds.push(parseInt(residentId));
    }
    return { ...activities[index] };
  },

  async removeAttendee(id, residentId) {
    await delay(200);
    const index = activities.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Activity not found");
    }
    activities[index].attendeeIds = activities[index].attendeeIds.filter(
      id => id !== parseInt(residentId)
    );
    return { ...activities[index] };
  }
};