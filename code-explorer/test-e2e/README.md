Chạy project
Lệnh	                                        Chức năng
npm test	                                    Chạy toàn bộ test
npm run test:headed	                            Chạy có giao diện Chrome
npm run test:ui	                                Mở Playwright UI
npm run test:debug	                            Debug từng bước
npm run test:report	                            Xem báo cáo HTML
npx playwright test --project=desktop-full-hd   Chỉ chạy project Full HD
npx playwright test tests/desktop.spec.js       Chỉ chạy file test cụ thể

npx playwright test tests/code-analyzer.spec.js