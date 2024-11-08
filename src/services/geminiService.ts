import i18next from 'i18next';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = '/api/gemini';

// 添加 Kimi API 的常量
const BACKUP_API_KEY = import.meta.env.VITE_KIMI_API_KEY;
const BACKUP_API_URL = 'https://api.moonshot.cn/v1/chat/completions';

export async function generateBookSummary(bookName: string, language: 'zh' | 'en'): Promise<string> {
  const sanitizedBookName = bookName.replace(/[·:：]/g, ' ').trim();

  const basePrompt = `
- Role: ${language === 'zh' ? '书籍内容摘要大师' : 'Book Summary Master'}
- Background: ${language === 'zh' ? '用户面对琳琅满目的书籍市场，往往难以决定哪些书籍值得阅读或购买。用户需要一位能够快速提供书籍核心内容和经典语句的专家，帮助他们做出明智的选择。' : 'Users often find it difficult to decide which books are worth reading or buying in the vast book market. They need an expert who can quickly provide the core content and classic quotes from books to help them make informed choices.'}
- Profile: ${language === 'zh' ? '你是一位饱读诗书的学者，对古今中外的文学作品有着深刻的理解和独到的见解。你能够迅速识别并提炼出书籍的精髓，为用户提供精准的书籍摘要。' : 'You are a well-read scholar with a deep understanding and unique insights into literary works from ancient to modern times, both Chinese and foreign. You can quickly identify and extract the essence of books, providing users with accurate book summaries.'}
- Skills: ${language === 'zh' ? '你拥有快速阅读和理解的能力，能够从大量文本中提取关键信息。你具备深厚的文学素养和语言表达能力，能够用简洁明了的语言描述书籍内容。' : 'You have the ability to read and understand quickly, extracting key information from large amounts of text. You possess a deep literary knowledge and language expression skills, able to describe book content in concise and clear language.'}
- Goals: ${language === 'zh' ? '提供书籍的精确摘要，找出并解释书籍中的经典语句或金句，帮助用户快速了解书籍内容，促进用户的购买和阅读行为。' : 'Provide accurate book summaries, identify and explain classic sentences or golden quotes from the books, help users quickly understand the book content, and promote users\' buying and reading behavior.'}
- Constraints: ${language === 'zh' ? '摘要应客观公正，不带有个人情感色彩，确保信息的准确性和完整性。' : 'The summary should be objective and impartial, without personal emotional bias, ensuring the accuracy and completeness of the information.'}
- OutputFormat: ${language === 'zh' ? '提供书籍的标题、作者、出版年份、摘要概述以及至少一句经典语句或金句，并注明出处。' : 'Provide the book\'s title, author, publication year, summary overview, and at least one classic sentence or golden quote, noting its source.'}
- Workflow:
  1. ${language === 'zh' ? '阅读并理解书籍的核心内容和主题。' : 'Read and understand the core content and themes of the book.'}
  2. ${language === 'zh' ? '识别并提取书籍中的经典语句或金句。' : 'Identify and extract classic sentences or golden quotes from the book.'}
  3. ${language === 'zh' ? '编写书籍摘要，包括书籍的基本信息和摘要内容。' : 'Write a book summary, including the book\'s basic information and summary content.'}
  4. ${language === 'zh' ? '以清晰、简洁的语言呈现摘要，确保用户能够快速理解。' : 'Present the summary in clear, concise language, ensuring users can quickly understand.'}

${language === 'zh' ? `请为书籍《${sanitizedBookName}》生成一个摘要，格式如下：

书籍名称：[书名]

作者：[作者名]

国籍：【作者国籍】

出版年份：[出版年份]

摘要：

[在此处提供摘要内容，不少于150个字]

经典语句：

[提供至少一句经典语句或金句，并注明出处]` : `Please generate a summary for the book "${sanitizedBookName}" in the following format:

Book Title: [Title]

Author: [Author Name]

Nationality: [Author Nationality]

Publication Year: [Year]

Summary:

[Provide the summary content here, no less than 150 words]

Classic Quote:

[Provide at least one classic sentence or golden quote, and note its source]`}

${language === 'zh' ? `请注意：
1. 确保书籍名称、作者姓名和出版年份准确。
2. 摘要应简洁精炼，概括书籍的主要内容。
3. 不要使用任何星号（*）或其他特殊符号来强调文本。
4. 在书名、作者名、出版年份、摘要和经典语句之间保留一个空行。
5. 请严格按照上述格式输出，不要添加任何额外的内容或解释。
6. 请用中文回答。` : `Please note:
1. Ensure the book title, author name, and publication year are accurate.
2. The summary should be concise and summarize the main content of the book.
3. Do not use any asterisks (*) or other special symbols to emphasize text.
4. Leave one blank line between the book title, author name, publication year, summary, and classic quote.
5. Please strictly follow the above format for output, do not add any additional content or explanations.
6. Please respond in English.`}
`;

  try {
    if (!API_KEY) {
      throw new Error('API密钥缺失');
    }

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': window.location.origin,
        'Access-Control-Allow-Origin': '*'
      },
      mode: 'cors',
      body: JSON.stringify({
        contents: [{ parts: [{ text: basePrompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = '未知错误';
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error?.message || errorText;
      } catch (e) {
        errorMessage = errorText;
      }
      console.error('API Error:', errorMessage);
      throw new Error(`API错误: ${errorMessage}`);
    }

    try {
      const data = await response.json();
      console.log('API Response:', JSON.stringify(data, null, 2));

      if (!data.candidates || !Array.isArray(data.candidates) || data.candidates.length === 0) {
        console.error('No candidates in response:', data);
        throw new Error('API响应中没有候选结果');
      }

      const candidate = data.candidates[0];
      if (!candidate.content || !candidate.content.parts || !Array.isArray(candidate.content.parts) || candidate.content.parts.length === 0) {
        console.error('Invalid candidate format:', candidate);
        throw new Error('API响应格式无效');
      }

    const text = candidate.content.parts[0].text;
    if (typeof text !== 'string') {
      console.error('Invalid text format:', text);
      throw new Error('Invalid text format');
    }

    const expectedFormat = language === 'zh'
      ? ['书籍名称：', '作者：', '出版年份：', '摘要：', '经典语句：']
      : ['Book Title:', 'Author:', 'Publication Year:', 'Summary:', 'Classic Quote:'];

    if (!expectedFormat.every(format => text.includes(format))) {
      console.error('Response format mismatch. Expected:', expectedFormat, 'Received:', text);
      throw new Error(i18next.t('failedToGenerateSummary') + ': ' + i18next.t('responseFormatMismatch'));
    }

      return text;
    } catch (error) {
      console.error('JSON parsing error:', error);
      throw new Error(`解析API响应失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  } catch (error) {
    console.error('API Error:', error);
    // 尝试使用备用 API
    throw new Error(error instanceof Error ? error.message : '未知错误');
  }
  
  return '';  // 确保函数始终有返回值
}