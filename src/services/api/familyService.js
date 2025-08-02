import { toast } from "react-toastify";

export const familyService = {
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
          { field: { Name: "familyId" } },
          { field: { Name: "familyName" } },
          { field: { Name: "memberIds" } },
          { field: { Name: "headId" } },
          { field: { Name: "ward" } },
          { field: { Name: "street" } },
          { field: { Name: "houseNumber" } },
          { field: { Name: "ownershipStatus" } },
          { field: { Name: "electricityConnection" } },
          { field: { Name: "waterConnection" } },
          { field: { Name: "sanitationFacility" } }
        ],
        orderBy: [{ fieldName: "familyName", sorttype: "ASC" }]
      };

      const response = await apperClient.fetchRecords("family", params);
      
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
        console.error("Error fetching families:", error?.response?.data?.message);
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
          { field: { Name: "familyId" } },
          { field: { Name: "familyName" } },
          { field: { Name: "memberIds" } },
          { field: { Name: "headId" } },
          { field: { Name: "ward" } },
          { field: { Name: "street" } },
          { field: { Name: "houseNumber" } },
          { field: { Name: "ownershipStatus" } },
          { field: { Name: "electricityConnection" } },
          { field: { Name: "waterConnection" } },
          { field: { Name: "sanitationFacility" } }
        ]
      };

      const response = await apperClient.getRecordById("family", id, params);

      if (!response || !response.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching family with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(familyData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const updateableData = {
        Name: familyData.familyName || familyData.Name,
        Tags: familyData.Tags || "",
        Owner: familyData.Owner,
        familyId: familyData.familyId,
        familyName: familyData.familyName,
        memberIds: familyData.memberIds || "",
        headId: familyData.headId,
        ward: familyData.ward,
        street: familyData.street,
        houseNumber: familyData.houseNumber,
        ownershipStatus: familyData.ownershipStatus,
        electricityConnection: familyData.electricityConnection,
        waterConnection: familyData.waterConnection,
        sanitationFacility: familyData.sanitationFacility
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord("family", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create family ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating family:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, familyData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const updateableData = {
        Id: parseInt(id),
        Name: familyData.familyName || familyData.Name,
        Tags: familyData.Tags,
        Owner: familyData.Owner,
        familyId: familyData.familyId,
        familyName: familyData.familyName,
        memberIds: familyData.memberIds,
        headId: familyData.headId,
        ward: familyData.ward,
        street: familyData.street,
        houseNumber: familyData.houseNumber,
        ownershipStatus: familyData.ownershipStatus,
        electricityConnection: familyData.electricityConnection,
        waterConnection: familyData.waterConnection,
        sanitationFacility: familyData.sanitationFacility
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord("family", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update family ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating family:", error?.response?.data?.message);
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

      const response = await apperClient.deleteRecord("family", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete family ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting family:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  },

  async search(query) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "familyId" } },
          { field: { Name: "familyName" } },
          { field: { Name: "memberIds" } },
          { field: { Name: "headId" } },
          { field: { Name: "ward" } },
          { field: { Name: "street" } },
          { field: { Name: "houseNumber" } },
          { field: { Name: "ownershipStatus" } },
          { field: { Name: "electricityConnection" } },
          { field: { Name: "waterConnection" } },
          { field: { Name: "sanitationFacility" } }
        ],
        whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "familyName",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: ""
              },
              {
                conditions: [
                  {
                    fieldName: "familyId",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: ""
              },
              {
                conditions: [
                  {
                    fieldName: "ward",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: ""
              },
              {
                conditions: [
                  {
                    fieldName: "street",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: ""
              }
            ]
          }
        ]
      };

      const response = await apperClient.fetchRecords("family", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error searching families:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }
};