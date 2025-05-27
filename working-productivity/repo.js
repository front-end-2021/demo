const positions = ["Giám đốc điều hành", "Trưởng phòng Kinh doanh", "Trưởng phòng Nhân sự",
    "Nhân viên Kế toán", "Nhân viên Hành chính", "Nhân viên Kinh doanh",
    "Nhân viên Thử việc", "Nhân viên Tập sự"];
const names = ['Nguyễn Văn', 'Nguyễn Thị', 'Nguyễn Bá', 'Trần Văn', 'Ngô Bá', 'Vũ Văn', 'Lưu Minh', 'Lưu Văn', 'Nguyễn Hải', 'Đỗ Thúy', 'Lê Văn', 'Hoàng Minh']
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const colors = ['#5b4a30', '#2f46d8', '#e164f1', '#e0a717', '#606468', '#23c7cf', '#a3c311', '#f4a011', '#e0cec9', '#8e6a61', '#b2857a', '#b4928c', '#dfd0ce', '#684640',
    '#95645c', '#87706e', '#694d4b', '#84615e', '#ebdcdb', '#bd8b87', '#8a5854', '#ad6f69', '#725d5d', '#a48585', '#7d5252', '#fba5a5', '#fb8f8f', '#fb7474', '#9b6d6d',
    '#905d5d', '#6f592c', '#4c2407', '#331805', '#7f3d0d', '#fff1e8', '#050833', '#1a2cff', '#1affed', '#1a9fff', '#8d4545', '#51343e', '#151517']
export function getUsers() {
    const jsonData = [];
    for (let i = 1, fName, lName, start; i <= 100; i++) {
        fName = names[Math.floor(Math.random() * names.length)]
        lName = characters[Math.floor(Math.random() * characters.length)]
        start = randomDate(2018, 2024)
        jsonData.push({
            Id: uuidv4(),
            Name: `${fName} ${lName}`,
            Start: start.toDateString(),
            Position: positions[Math.floor(Math.random() * positions.length)],
            Avatar: `${lName}`,
            Background: `${colors[Math.floor(Math.random() * colors.length)]}`,
            Password: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', // SHA256(123456)
        });
    }
    return jsonData
}
const jobNames = [
    "Bán xe sedan", "Bán xe SUV", "Bán xe thể thao", "Bán xe tải", "Bán xe hybrid", "Bán xe điện", "Bán phụ kiện xe hơi", "Tư vấn mua xe", "Cho thuê xe hơi", "Bán xe cổ điển"
];
export function getTasks() {
    const jsonData = [];
    for (let i = 1; i <= 900; i++) {
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + Math.floor(Math.random() * (90 - 7 + 1)) + 7); // từ 1 tuần đến 3 tháng

        jsonData.push({
            Id: uuidv4(),
            Name: jobNames[Math.floor(Math.random() * jobNames.length)],
            Start: startDate.toDateString(),
            End: endDate.toDateString(),
            UserIds: []
        });
    }
    return jsonData
}
export const regions = [
    { Id: 1, Name: 'Vùng Trung du và miền núi Bắc Bộ', Group: 'Miền Bắc' },
    { Id: 2, Name: 'Vùng Đồng bằng sông Hồng', Group: 'Miền Bắc' },
    { Id: 3, Name: 'Vùng Đông Bắc', Group: 'Miền Bắc' },
    { Id: 4, Name: 'Vùng Tây Bắc', Group: 'Miền Bắc' },
    { Id: 5, Name: 'Vùng Bắc Trung Bộ', Group: 'Miền Trung' },
    { Id: 6, Name: 'Vùng Duyên hải Nam Trung Bộ', Group: 'Miền Trung' },
    { Id: 7, Name: 'Vùng Tây Nguyên', Group: 'Miền Trung' },
    { Id: 8, Name: 'Vùng Đông Nam Bộ', Group: 'Miền Nam' },
    { Id: 9, Name: 'Vùng Đồng bằng sông Cửu Long', Group: 'Miền Nam' }
]
function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}
function randomDate(startYear = 2021, endYear) {
    const start = new Date(startYear, 0, 1); // Ngày bắt đầu từ 1/1/2021
    let end
    if (typeof endYear != 'number' && startYear <= endYear) {
        end = new Date(endYear, 11, 31)
    } else end = new Date()
    const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
    return new Date(randomTime);
}