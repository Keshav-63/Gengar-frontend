export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

export const validateFileName = (fileName: string): boolean => {
  // File name should not be empty and not start with a dot
  return fileName.length > 0 && !fileName.startsWith('.');
};

export const validateFolderName = (folderName: string): boolean => {
  // Folder name should not be empty or contain only spaces
  return folderName.trim().length > 0;
};

export const getFileSizeError = (size: number, maxSize: number = 5 * 1024 * 1024 * 1024): string | null => {
  if (size > maxSize) {
    return `File size exceeds maximum limit of 5GB`;
  }
  return null;
};

export const validateFileType = (mimeType: string, allowedTypes: string[] = []): boolean => {
  if (allowedTypes.length === 0) return true;
  return allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      const prefix = type.split('/')[0];
      return mimeType.startsWith(prefix);
    }
    return mimeType === type;
  });
};

export const validateSharePermission = (permission: string): boolean => {
  return ['view', 'download', 'edit'].includes(permission);
};

export const validateExpiryDays = (days: number | null): boolean => {
  if (days === null) return true; // Never expires
  return days > 0 && days <= 365;
};
