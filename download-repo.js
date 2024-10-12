import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';

const owner = 'gameloft333';
const repo = 'sb1-nrx5u9';
const branch = 'main';

async function downloadFile(url, filePath) {
  const response = await fetch(url);
  const content = await response.text();
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content);
  console.log(`Downloaded: ${filePath}`);
}

async function processContents(contents, currentPath = '') {
  for (const item of contents) {
    if (item.type === 'file') {
      await downloadFile(item.download_url, path.join(currentPath, item.name));
    } else if (item.type === 'dir') {
      const subContents = await fetchContents(item.path);
      await processContents(subContents, path.join(currentPath, item.name));
    }
  }
}

async function fetchContents(path = '') {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
  const response = await fetch(url);
  return response.json();
}

async function downloadRepo() {
  try {
    const contents = await fetchContents();
    await processContents(contents);
    console.log('Repository contents downloaded successfully!');
  } catch (error) {
    console.error('Error downloading repository:', error.message);
  }
}

downloadRepo();