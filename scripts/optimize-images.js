// node scripts/optimize-images.js
const sharp = require('sharp');
const glob = require('glob');
const fs = require('fs').promises;
const path = require('path');

const QUALITY = 75;
const INPUT_DIR = 'out/images';

async function optimizeImage(inputPath) {
  try {
    const outputPath = inputPath;
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // 如果是 PNG，转换为 WebP
    if (metadata.format === 'png') {
      await image
        .webp({ quality: QUALITY })
        .toFile(outputPath.replace(/\.png$/, '.webp'));
      await fs.unlink(inputPath); // 删除原始 PNG 文件
      console.log(`转换并压缩: ${inputPath} -> ${outputPath.replace(/\.png$/, '.webp')}`);
      return;
    }

    // 如果是 JPEG/JPG，压缩
    if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
      await image
        .jpeg({ quality: QUALITY })
        .toBuffer()
        .then(data => fs.writeFile(outputPath, data));
      console.log(`压缩: ${inputPath}`);
      return;
    }

    console.log(`跳过: ${inputPath} (不支持的格式: ${metadata.format})`);
  } catch (error) {
    console.error(`处理 ${inputPath} 时出错:`, error);
  }
}

async function optimizeImages() {
  try {
    // 获取所有图片文件
    const files = glob.sync(`${INPUT_DIR}/**/*.{jpg,jpeg,png}`);

    if (files.length === 0) {
      console.log('没有找到需要优化的图片');
      return;
    }

    console.log(`找到 ${files.length} 个图片文件需要优化`);

    // 并行处理所有图片
    await Promise.all(files.map(file => optimizeImage(file)));

    console.log('图片优化完成！');
  } catch (error) {
    console.error('优化过程中出错:', error);
  }
}

optimizeImages(); 