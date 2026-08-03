export const formatSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";

    const units = ["B", "KB", "MB", "GB"];
    const base = 1024;

    const index = Math.floor(Math.log(bytes) / Math.log(base));
    const size = bytes / Math.pow(base, index);

    return `${parseFloat(size.toFixed(2))} ${units[index]}`;
};

export const generateUUID = () => crypto.randomUUID