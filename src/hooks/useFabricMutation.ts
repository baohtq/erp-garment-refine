"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  useCreate,
  useUpdate,
  useDelete,
  useResource,
  BaseKey,
  useNotification,
  HttpError,
  BaseRecord
} from "@refinedev/core";
import { Fabric } from '@/types/fabric-management';

/**
 * Custom hook để xử lý mutation cho fabric
 */
export const useFabricMutation = () => {
  const queryClient = useQueryClient();
  const { resource } = useResource();
  const { open: openNotification } = useNotification();

  // Sử dụng mutation từ Refine với callback tùy chỉnh
  const {
    mutate: createFabric,
    isLoading: isCreating
  } = useCreate();

  // Mutation cập nhật fabric
  const {
    mutate: updateFabric,
    isLoading: isUpdating
  } = useUpdate();

  // Mutation xóa fabric
  const {
    mutate: deleteFabric,
    isLoading: isDeleting
  } = useDelete();

  // Hàm tạo vải mới
  const handleCreateFabric = (
    data: Omit<Fabric, "id" | "created_at" | "updated_at">,
    successCallback?: () => void
  ) => {
    createFabric(
      {
        resource: "fabrics",
        values: {
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      },
      {
        onSuccess: (data) => {
          if (openNotification) {
            openNotification({
              type: "success",
              message: "Tạo vải mới thành công",
              description: `Vải ${data?.data?.name || ""} đã được tạo mới`,
            });
          }
          
          // Tự động cập nhật lại danh sách vải
          queryClient.invalidateQueries({
            queryKey: ["fabrics"],
          });
          
          if (successCallback) successCallback();
        },
        onError: (error) => {
          if (openNotification) {
            openNotification({
              type: "error",
              message: "Lỗi khi tạo vải mới",
              description: error?.message || "Vui lòng thử lại",
            });
          }
        },
      }
    );
  };

  // Hàm cập nhật vải
  const handleUpdateFabric = (
    id: BaseKey,
    data: Partial<Omit<Fabric, "id" | "created_at" | "updated_at">>,
    successCallback?: () => void
  ) => {
    updateFabric(
      {
        resource: "fabrics",
        id,
        values: {
          ...data,
          updated_at: new Date().toISOString(),
        },
      },
      {
        onSuccess: (data) => {
          if (openNotification) {
            openNotification({
              type: "success",
              message: "Cập nhật vải thành công",
              description: `Vải ${data?.data?.name || ""} đã được cập nhật`,
            });
          }
          
          // Cập nhật dữ liệu trong cache
          queryClient.invalidateQueries({
            queryKey: ["fabrics", id.toString()],
          });
          
          // Cập nhật danh sách vải
          queryClient.invalidateQueries({
            queryKey: ["fabrics"],
          });
          
          if (successCallback) successCallback();
        },
        onError: (error) => {
          if (openNotification) {
            openNotification({
              type: "error",
              message: "Lỗi khi cập nhật vải",
              description: error?.message || "Vui lòng thử lại",
            });
          }
        },
      }
    );
  };

  // Hàm xóa vải
  const handleDeleteFabric = (
    id: BaseKey,
    successCallback?: () => void
  ) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa vải này?")) {
      deleteFabric(
        {
          id,
          resource: "fabrics",
        },
        {
          onSuccess: () => {
            if (openNotification) {
              openNotification({
                type: "success",
                message: "Xóa vải thành công",
                description: "Vải đã được xóa khỏi hệ thống",
              });
            }
            
            // Cập nhật danh sách vải
            queryClient.invalidateQueries({
              queryKey: ["fabrics"],
            });
            
            if (successCallback) successCallback();
          },
          onError: (error: HttpError) => {
            if (openNotification) {
              openNotification({
                type: "error",
                message: "Lỗi khi xóa vải",
                description: error?.message || "Vui lòng thử lại",
              });
            }
          },
        }
      );
    }
  };
  
  return {
    handleCreateFabric,
    handleUpdateFabric,
    handleDeleteFabric,
    isCreating,
    isUpdating,
    isDeleting,
  };
}; 