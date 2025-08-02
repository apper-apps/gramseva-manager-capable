import issuesData from "@/services/mockData/issues.json";

let issues = [...issuesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const issueService = {
  async getAll() {
    await delay(300);
    return [...issues];
  },

  async getById(id) {
    await delay(200);
    const issue = issues.find(i => i.Id === parseInt(id));
    if (!issue) {
      throw new Error("Issue not found");
    }
    return { ...issue };
  },

  async create(issueData) {
    await delay(400);
    const maxId = Math.max(...issues.map(i => i.Id), 0);
    const newIssue = {
      Id: maxId + 1,
      ...issueData,
      status: "Open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: []
    };
    issues.push(newIssue);
    return { ...newIssue };
  },

  async update(id, issueData) {
    await delay(350);
    const index = issues.findIndex(i => i.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Issue not found");
    }
    issues[index] = {
      ...issues[index],
      ...issueData,
      updatedAt: new Date().toISOString()
    };
    return { ...issues[index] };
  },

  async delete(id) {
    await delay(250);
    const index = issues.findIndex(i => i.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Issue not found");
    }
    const deleted = issues.splice(index, 1)[0];
    return { ...deleted };
  },

  async updateStatus(id, status) {
    await delay(300);
    const index = issues.findIndex(i => i.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Issue not found");
    }
    issues[index] = {
      ...issues[index],
      status,
      updatedAt: new Date().toISOString()
    };
    return { ...issues[index] };
  },

  async addComment(id, comment) {
    await delay(250);
    const index = issues.findIndex(i => i.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Issue not found");
    }
    const newComment = {
      id: Date.now(),
      ...comment,
      timestamp: new Date().toISOString()
    };
    issues[index].comments.push(newComment);
    issues[index].updatedAt = new Date().toISOString();
    return { ...issues[index] };
  }
};