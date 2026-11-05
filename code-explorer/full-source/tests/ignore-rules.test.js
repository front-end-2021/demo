import test from 'node:test'
import assert from 'node:assert/strict'
import { createPathClassifier, classifyVendorPath, isVendorText } from '../src/core/ignore-rules.js'

const classify = createPathClassifier()

test('thư mục bị bỏ qua: danh sách mặc định + mọi thư mục dấu chấm', () => {
  assert.equal(classify('node_modules/x/index.js'), 'ignored-dir')
  assert.equal(classify('src/bin/Debug/a.cs'), 'ignored-dir')
  assert.equal(classify('.git/config'), 'ignored-dir')
  assert.equal(classify('.vs/x.json'), 'ignored-dir')
  assert.equal(classify('src/.idea/workspace.xml'), 'ignored-dir')
  assert.equal(classify('src/app.js'), null)
})

test('code-viewer: mọi thư mục nó bỏ qua đều được bộ quy tắc chung bỏ qua', () => {
  const codeViewerDirs = ['bin', 'obj', '.vs', '.vscode', 'target', '.gradle', '.idea', 'build', 'venv', '.venv', '__pycache__', 'env', 'node_modules', '.git']
  for (const d of codeViewerDirs) assert.equal(classify(`${d}/f.txt`), 'ignored-dir', d)
})

test('nhị phân, lock file, file sinh ra', () => {
  assert.equal(classify('img/logo.PNG'), 'binary')
  assert.equal(classify('lib/a.dll'), 'binary')
  assert.equal(classify('package-lock.json'), 'generated')
  assert.equal(classify('web/app.min.js'), 'generated')
  assert.equal(classify('types/foo.d.ts'), 'generated')
  assert.equal(classify('a.js.map'), 'generated')
})

test('đuôi lạ KHÔNG bị loại (khác danh sách trắng cũ của code-viewer)', () => {
  assert.equal(classify('App.csproj'), null)
  assert.equal(classify('deploy/run.ps1'), null)
  assert.equal(classify('Makefile'), null)
})

test('vendor / mã sinh tự động: bỏ qua mặc định, bật lại bằng includeVendor', () => {
  assert.equal(classify('Service References/Foo/Bar.cs'), 'vendor')
  assert.equal(classify('wwwroot/lib/x.js'), 'vendor')
  assert.equal(classify('wwwroot/lib/x.cs'), null) // thư mục lib chỉ tính với .js / .css
  assert.equal(classify('Scripts/jquery-3.6.0.js'), 'vendor')
  assert.equal(classify('Views/Foo.designer.cs'), 'generated')
  const all = createPathClassifier({ includeVendor: true })
  assert.equal(all('Service References/Foo/Bar.cs'), null)
  assert.equal(all('wwwroot/lib/x.js'), null)
  assert.equal(all('node_modules/x.js'), 'ignored-dir') // includeVendor không bật lại thư mục bị bỏ qua
})

test('.gitignore chỉ áp dụng khi không includeVendor (đúng như analyzer cũ)', () => {
  const isGitignored = (p) => p === 'secret.txt'
  assert.equal(createPathClassifier({ isGitignored })('secret.txt'), 'gitignore')
  assert.equal(createPathClassifier({ isGitignored })('public.txt'), null)
  assert.equal(createPathClassifier({ isGitignored, includeVendor: true })('secret.txt'), null)
})

test('isVendorText nhận ra banner bản quyền và UMD, chỉ với .js/.css', () => {
  assert.equal(isVendorText('.js', '/*! jQuery v3 | (c) OpenJS Foundation | MIT */'), true)
  assert.equal(isVendorText('.js', "(function(r){ if (typeof exports === 'object' && typeof module !== 'undefined') {} })"), true)
  assert.equal(isVendorText('.js', 'export const a = 1'), false)
  assert.equal(isVendorText('.cs', '/*! x */'), false)
  assert.equal(classifyVendorPath('src/app.js'), null)
})
