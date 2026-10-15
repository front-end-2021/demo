export function getSizeInBytes(codeString) {
    const blob = new Blob([codeString], { type: 'text/plain' });// Tạo một Blob với kiểu dữ liệu text thuần
    return blob.size; // Trả về số lượng byte
}
export function formatSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}