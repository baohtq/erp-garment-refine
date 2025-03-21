const fs = require('fs');
const path = require('path');

// Đường dẫn đến thư mục src
const srcDir = path.join(__dirname, 'src');

// Đếm số file được sửa
let modifiedFileCount = 0;

// Hàm để đệ quy duyệt tất cả các file và thư mục
function traverseDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Nếu là thư mục, đệ quy vào bên trong
      traverseDirectory(fullPath);
    } else if (stat.isFile() && (file.endsWith('.ts') || file.endsWith('.tsx'))) {
      // Nếu là file TypeScript hoặc React, kiểm tra và sửa
      fixImports(fullPath);
    }
  }
}

// Hàm để sửa các import path trong file
function fixImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Tìm và thay thế tất cả import from '@utils/
  const originalContent = content;
  content = content.replace(/from\s+['"]@utils\//g, 'from \'@/utils/');
  
  // Tìm và thay thế import { x } from '@utils/
  content = content.replace(/from\s+['"]\@utils\//g, 'from \'@/utils/');
  
  // Nếu có thay đổi, ghi lại file
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Đã sửa file: ${filePath}`);
    modifiedFileCount++;
  }
}

// Bắt đầu duyệt từ thư mục src
console.log('Bắt đầu sửa các import path...');
traverseDirectory(srcDir);
console.log(`Hoàn thành! Đã sửa ${modifiedFileCount} file.`); 