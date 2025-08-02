import { toast } from "react-toastify";

export const issueService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "category" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "priority" } },
          { field: { Name: "status" } },
          { field: { Name: "reporterId" } },
          { field: { Name: "reporterName" } },
          { field: { Name: "assigneeId" } },
          { field: { Name: "assigneeName" } },
          { field: { Name: "ward" } },
          { field: { Name: "street" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "comments" } }
        ],
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }]
      };

      const response = await apperClient.fetchRecords("issue", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching issues:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "category" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "priority" } },
          { field: { Name: "status" } },
          { field: { Name: "reporterId" } },
          { field: { Name: "reporterName" } },
          { field: { Name: "assigneeId" } },
          { field: { Name: "assigneeName" } },
          { field: { Name: "ward" } },
          { field: { Name: "street" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "comments" } }
        ]
      };

      const response = await apperClient.getRecordById("issue", id, params);

      if (!response || !response.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching issue with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(issueData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const updateableData = {
        Name: issueData.title || issueData.Name,
        Tags: issueData.Tags || "",
        Owner: issueData.Owner,
        category: issueData.category,
        title: issueData.title,
        description: issueData.description,
        priority: issueData.priority,
        status: issueData.status || "Open",
        reporterId: issueData.reporterId,
        reporterName: issueData.reporterName,
        assigneeId: issueData.assigneeId,
        assigneeName: issueData.assigneeName,
        ward: issueData.ward,
        street: issueData.street,
        dueDate: issueData.dueDate,
        comments: issueData.comments || ""
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord("issue", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create issue ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating issue:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, issueData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const updateableData = {
        Id: parseInt(id),
        Name: issueData.title || issueData.Name,
        Tags: issueData.Tags,
        Owner: issueData.Owner,
        category: issueData.category,
        title: issueData.title,
        description: issueData.description,
        priority: issueData.priority,
        status: issueData.status,
        reporterId: issueData.reporterId,
        reporterName: issueData.reporterName,
        assigneeId: issueData.assigneeId,
        assigneeName: issueData.assigneeName,
        ward: issueData.ward,
        street: issueData.street,
        dueDate: issueData.dueDate,
        comments: issueData.comments
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord("issue", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update issue ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating issue:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord("issue", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete issue ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting issue:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  },

  async updateStatus(id, status) {
    try {
      return await this.update(id, { status });
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating issue status:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async addComment(id, comment) {
    try {
      // For now, we'll update the comments field
      // In a full implementation, comments might be a separate table
      const currentIssue = await this.getById(id);
      if (!currentIssue) {
        throw new Error("Issue not found");
      }

      const currentComments = currentIssue.comments || "";
      const newComment = `${currentComments}\n${comment.author}: ${comment.message} (${new Date().toISOString()})`;
      
      return await this.update(id, { comments: newComment });
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error adding comment:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }
};