const { test, expect } = require('@playwright/test');

test.describe('Desktop Full HD Testing', () => {

    test('Kiểm tra giao diện Full HD', async ({ page }) => {

        // await page.goto('https://example.com');
        
        await page.goto('/'); // Tự động sử dụng BASE_URL trong config
        const viewport = page.viewportSize(); // Kiểm tra kích thước viewport

        expect(viewport?.width).toBe(1920);
        expect(viewport?.height).toBe(1080);

        // # A. Kiểm tra đúng kích thước viewport
        // expect(page.viewportSize()).toEqual({
        //     width: 1920, height: 1080,
        // });

        // # B. Kiểm tra phần tử không bị tràn ngang
        // const overflow = await page.evaluate(() => {
        //     return document.documentElement.scrollWidth >
        //         document.documentElement.clientWidth;
        // });
        // expect(overflow).toBe(false);

        await expect(page).toHaveTitle(/Example Domain/); // Kiểm tra tiêu đề

        // Chụp ảnh màn hình toàn bộ trang
        await page.screenshot({
            path: 'screenshots/desktop-full-hd.png',
            fullPage: true,
        });

    });
});
