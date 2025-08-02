import { toast } from "react-toastify";

export const residentService = {
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
          { field: { Name: "age" } },
          { field: { Name: "gender" } },
          { field: { Name: "houseNumber" } },
          { field: { Name: "occupation" } },
          { field: { Name: "familyId" } },
          { field: { Name: "familyRole" } },
          { field: { Name: "phoneNumber" } },
          { field: { Name: "aadhaarNumber" } },
          { field: { Name: "education" } },
          { field: { Name: "category" } },
          { field: { Name: "religion" } },
          { field: { Name: "motherTongue" } },
          { field: { Name: "bplStatus" } },
          { field: { Name: "ward" } },
          { field: { Name: "street" } }
        ],
        orderBy: [{ fieldName: "Name", sorttype: "ASC" }]
      };

      const response = await apperClient.fetchRecords("resident", params);
      
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
        console.error("Error fetching residents:", error?.response?.data?.message);
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
          { field: { Name: "age" } },
          { field: { Name: "gender" } },
          { field: { Name: "houseNumber" } },
          { field: { Name: "occupation" } },
          { field: { Name: "familyId" } },
          { field: { Name: "familyRole" } },
          { field: { Name: "phoneNumber" } },
          { field: { Name: "aadhaarNumber" } },
          { field: { Name: "education" } },
          { field: { Name: "category" } },
          { field: { Name: "religion" } },
          { field: { Name: "motherTongue" } },
          { field: { Name: "bplStatus" } },
          { field: { Name: "ward" } },
          { field: { Name: "street" } }
        ]
      };

      const response = await apperClient.getRecordById("resident", id, params);

      if (!response || !response.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching resident with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(residentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const updateableData = {
        Name: residentData.name || residentData.Name,
        Tags: residentData.Tags || "",
        Owner: residentData.Owner,
        age: parseInt(residentData.age),
        gender: residentData.gender,
        houseNumber: residentData.houseNumber,
        occupation: residentData.occupation,
        familyId: residentData.familyId,
        familyRole: residentData.familyRole,
        phoneNumber: residentData.phoneNumber,
        aadhaarNumber: residentData.aadhaarNumber,
        education: residentData.education,
        category: residentData.category,
        religion: residentData.religion,
        motherTongue: residentData.motherTongue,
        bplStatus: residentData.bplStatus,
        ward: residentData.ward,
        street: residentData.street
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord("resident", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create resident ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating resident:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, residentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const updateableData = {
        Id: parseInt(id),
        Name: residentData.name || residentData.Name,
        Tags: residentData.Tags,
        Owner: residentData.Owner,
        age: parseInt(residentData.age),
        gender: residentData.gender,
        houseNumber: residentData.houseNumber,
        occupation: residentData.occupation,
        familyId: residentData.familyId,
        familyRole: residentData.familyRole,
        phoneNumber: residentData.phoneNumber,
        aadhaarNumber: residentData.aadhaarNumber,
        education: residentData.education,
        category: residentData.category,
        religion: residentData.religion,
        motherTongue: residentData.motherTongue,
        bplStatus: residentData.bplStatus,
        ward: residentData.ward,
        street: residentData.street
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord("resident", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update resident ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating resident:", error?.response?.data?.message);
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

      const response = await apperClient.deleteRecord("resident", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete resident ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting resident:", error?.response?.data?.message);
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
          { field: { Name: "Name" } },
          { field: { Name: "age" } },
          { field: { Name: "gender" } },
          { field: { Name: "houseNumber" } },
          { field: { Name: "occupation" } },
          { field: { Name: "familyId" } },
          { field: { Name: "familyRole" } },
          { field: { Name: "category" } },
          { field: { Name: "ward" } },
          { field: { Name: "street" } }
        ],
        whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "Name",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: ""
              },
              {
                conditions: [
                  {
                    fieldName: "houseNumber",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: ""
              },
              {
                conditions: [
                  {
                    fieldName: "occupation",
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
              }
            ]
          }
        ]
      };

      const response = await apperClient.fetchRecords("resident", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error searching residents:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getByFamily(familyId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "age" } },
          { field: { Name: "gender" } },
          { field: { Name: "houseNumber" } },
          { field: { Name: "occupation" } },
          { field: { Name: "familyId" } },
          { field: { Name: "familyRole" } },
          { field: { Name: "category" } },
          { field: { Name: "ward" } },
          { field: { Name: "street" } }
        ],
        where: [
          {
            FieldName: "familyId",
            Operator: "EqualTo",
            Values: [familyId]
          }
        ]
      };

      const response = await apperClient.fetchRecords("resident", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching residents by family:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }
};