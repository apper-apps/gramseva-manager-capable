import { toast } from "react-toastify";

export const activityService = {
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
          { field: { Name: "title" } },
          { field: { Name: "type" } },
          { field: { Name: "description" } },
          { field: { Name: "date" } },
          { field: { Name: "time" } },
          { field: { Name: "endTime" } },
          { field: { Name: "location" } },
          { field: { Name: "organizerId" } },
          { field: { Name: "organizerName" } },
          { field: { Name: "maxParticipants" } },
          { field: { Name: "attendeeIds" } },
          { field: { Name: "status" } }
        ],
        orderBy: [{ fieldName: "date", sorttype: "DESC" }]
      };

      const response = await apperClient.fetchRecords("app_Activity", params);
      
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
        console.error("Error fetching activities:", error?.response?.data?.message);
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
          { field: { Name: "title" } },
          { field: { Name: "type" } },
          { field: { Name: "description" } },
          { field: { Name: "date" } },
          { field: { Name: "time" } },
          { field: { Name: "endTime" } },
          { field: { Name: "location" } },
          { field: { Name: "organizerId" } },
          { field: { Name: "organizerName" } },
          { field: { Name: "maxParticipants" } },
          { field: { Name: "attendeeIds" } },
          { field: { Name: "status" } }
        ]
      };

      const response = await apperClient.getRecordById("app_Activity", id, params);

      if (!response || !response.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching activity with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(activityData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const updateableData = {
        Name: activityData.title || activityData.Name,
        Tags: activityData.Tags || "",
        Owner: activityData.Owner,
        title: activityData.title,
        type: activityData.type,
        description: activityData.description,
        date: activityData.date,
        time: activityData.time,
        endTime: activityData.endTime,
        location: activityData.location,
        organizerId: activityData.organizerId,
        organizerName: activityData.organizerName,
        maxParticipants: activityData.maxParticipants,
        attendeeIds: activityData.attendeeIds || "",
        status: activityData.status || "Upcoming"
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord("app_Activity", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create activity ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating activity:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, activityData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const updateableData = {
        Id: parseInt(id),
        Name: activityData.title || activityData.Name,
        Tags: activityData.Tags,
        Owner: activityData.Owner,
        title: activityData.title,
        type: activityData.type,
        description: activityData.description,
        date: activityData.date,
        time: activityData.time,
        endTime: activityData.endTime,
        location: activityData.location,
        organizerId: activityData.organizerId,
        organizerName: activityData.organizerName,
        maxParticipants: activityData.maxParticipants,
        attendeeIds: activityData.attendeeIds,
        status: activityData.status
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord("app_Activity", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update activity ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating activity:", error?.response?.data?.message);
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

      const response = await apperClient.deleteRecord("app_Activity", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete activity ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting activity:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  },

  async addAttendee(id, residentId) {
    try {
      const currentActivity = await this.getById(id);
      if (!currentActivity) {
        throw new Error("Activity not found");
      }

      // Parse current attendee IDs (stored as comma-separated string)
      const currentAttendees = currentActivity.attendeeIds ? 
        currentActivity.attendeeIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [];

      if (!currentAttendees.includes(parseInt(residentId))) {
        currentAttendees.push(parseInt(residentId));
      }

      // Store as comma-separated string
      const updatedAttendeeIds = currentAttendees.join(',');
      
      return await this.update(id, { attendeeIds: updatedAttendeeIds });
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error adding attendee:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async removeAttendee(id, residentId) {
    try {
      const currentActivity = await this.getById(id);
      if (!currentActivity) {
        throw new Error("Activity not found");
      }

      // Parse current attendee IDs (stored as comma-separated string)
      const currentAttendees = currentActivity.attendeeIds ? 
        currentActivity.attendeeIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [];

      const updatedAttendees = currentAttendees.filter(attendeeId => attendeeId !== parseInt(residentId));

      // Store as comma-separated string
      const updatedAttendeeIds = updatedAttendees.join(',');
      
      return await this.update(id, { attendeeIds: updatedAttendeeIds });
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error removing attendee:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }
};