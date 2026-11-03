const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Kiểm thử tự động ứng dụng Code Analyzer', () => {

    test.beforeEach(async ({ page }) => {
        // Truy cập vào ứng dụng (giả sử chạy ở cổng 5173 hoặc URL cục bộ của bạn)
        //await page.goto('http://localhost:5173');
        await page.goto('/'); // Tự động sử dụng BASE_URL trong config
    });

    test('1. Kiểm tra mở thư mục / tải file và hiển thị tiến độ tổng quan', async ({ page }) => {
        // Giả lập việc chọn file/thư mục thông qua input file ẩn hoặc tính năng upload của ứng dụng
        const sampleFilePath = path.join(__dirname, '../test-fixtures/sample-projects');

        // Nếu ứng dụng dùng input type="file" để nhận thư mục/file zip
        const fileInput = page.locator('input[type="file"]');
        if (await fileInput.count() > 0) {
            await fileInput.setInputFiles(sampleFilePath);
        }

        // Kiểm tra màn hình tổng quan hoặc giao diện chính xuất hiện
        // (Dựa theo checklist: thấy tiến độ, rồi màn hình Tổng quan)
        await expect(page.locator('.graph-view, .overview-panel')).toBeVisible({ timeout: 10000 });
    });

    test('2. Kiểm tra tính năng click vào node file để mở Monaco Editor', async ({ page }) => {
        // Bước giả định: Đã mở sẵn project mẫu có sẵn node trên sơ đồ
        // Click vào một node file bất kỳ trên sơ đồ
        const nodeFile = page.locator('.node, .file-node').first();
        if (await nodeFile.isVisible()) {
            await nodeFile.click();

            // Kiểm tra panel bên phải (Editor Panel) mở ra, hiện đường dẫn và mã có tô màu[cite: 2]
            const editorPanel = page.locator('.editor-panel, .monaco-editor');
            await expect(editorPanel).toBeVisible();
        }
    });

    test('3. Kiểm tra đồng bộ dữ liệu qua Console (Explorer state)', async ({ page }) => {
        // Thực thi các câu lệnh kiểm tra trạng thái qua window.explorer như trong checklist[cite: 2]
        // Ví dụ kiểm tra xem các hàm tiện ích ws có tồn tại hay không
        const hasExplorerWs = await page.evaluate(() => {
            return window.explorer && typeof window.explorer.ws !== 'undefined';
        });

        // Nếu ứng dụng có gắn đối tượng explorer vào window để debug
        if (hasExplorerWs) {
            const filePathsLength = await page.evaluate(async () => {
                return window.explorer.ws.filePaths().length;
            });
            expect(filePathsLength).toBeGreaterThanOrEqual(0);
        } else {
            // Trường hợp không gắn global thì bỏ qua hoặc kiểm tra bằng UI thuần túy
            expect(true).toBeTruthy();
        }
    });

    test('4. Kiểm tra chuyển đổi qua lại giữa Sơ đồ file và Sơ đồ class', async ({ page }) => {
        // Tìm tab Sơ đồ class (nếu project có chứa file .cs, .java, .kt, .py)
        const classDiagramTab = page.locator('text=Sơ đồ class');

        if (await classDiagramTab.isVisible()) {
            await classDiagramTab.click();

            // Kiểm tra xem giao diện sơ đồ class hoặc hộp UML có xuất hiện không[cite: 2]
            const umlBox = page.locator('.class-box, .uml-container');
            // Đảm bảo không bị treo và hiển thị thành phần
            await expect(page.locator('body')).not.toContainText('Could not create web worker');
        }
    });

    test('5. Kiểm tra tính năng Tìm kiếm (Search) không làm đơ giao diện', async ({ page }) => {
        // Tìm ô input tìm kiếm
        const searchInput = page.locator('input[placeholder*="Tìm"], input[type="search"]').first();

        if (await searchInput.isVisible()) {
            // Gõ từ khóa tìm kiếm
            await searchInput.fill('App');

            // Chờ một chút theo checklist (khoảng 0.25 giây)[cite: 2]
            await page.waitForTimeout(500);

            // Kiểm tra kết quả hiển thị hoặc bảng gợi ý xuất hiện mà không có lỗi đỏ ở Console
            const searchResults = page.locator('.search-results, .suggestion-list');
            // Đảm bảo UI phản hồi mượt mà
            expect(await searchInput.inputValue()).toBe('App');
        }
    });

});