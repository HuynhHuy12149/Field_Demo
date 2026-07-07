import toast from "react-hot-toast";

export interface ValidationField {
  value: string | undefined | null;
  errorMessage: string;
}

/**
 * Kiểm tra một danh sách các trường. 
 * Nếu có bất kỳ trường nào bị rỗng, hiển thị Toast lỗi của trường đó và trả về false.
 * @param fields Danh sách các trường cần kiểm tra
 * @returns true nếu tất cả hợp lệ, false nếu có ít nhất 1 trường rỗng
 */
export const validateFields = (fields: ValidationField[]): boolean => {
  for (const field of fields) {
    if (!field.value || !field.value.trim()) {
      toast.error(field.errorMessage);
      return false; // Dừng ngay ở lỗi đầu tiên
    }
  }
  return true;
};
