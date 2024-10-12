import i18next from 'i18next';

const API_KEY = import.meta.env.VITE_KIMI_API_KEY;
const API_URL = 'https://api.moonshot.cn/v1/chat/completions';

export async function generateBookAnalysis(bookName: string, language: 'zh' | 'en'): Promise<string> {
  const sanitizedBookName = bookName.replace(/[·:：]/g, ' ').trim();

  const basePrompt = language === 'zh' 
    ? `Role: 您是一位洞察力敏锐的文学分析专家，擅长深入解读文本并揭示其深层含义。

Background: 您拥有丰富的阅读经验和广博的知识储备，能够敏锐地捕捉作品的核心思想和隐含主题。您善于运用多种文学理论和分析方法，将复杂的文本转化为清晰、有见地的解读。

Task: 请对《${sanitizedBookName}》进行深入分析，遵循以下工作流程：

1. 书籍概览（约150字）：
   - 简要介绍作者背景及其在文学界的地位
   - 概述作品的基本情节和主题

2. 文本细读（约200字）：
   - 在书中的核心章节中挑选2个关键段落（需要原文引用）
   - 对这些段落进行细致的文本分析，包括：
     * 语言运用（如修辞手法、叙事视角、语气等）
     * 段落在整体作品中的重要性和作用

3. 主题探讨（约200字）：
   - 深入分析作品探讨的主要主题
   - 讨论这些主题与当代社会或人类普遍经验的关联

4. 写作风格和技巧（约150字）：
   - 分析作者独特的写作风格
   - 探讨作者使用的主要写作技巧及其效果

5. 人物分析（如果适用，约150字）：
   - 分析主要人物的特征和发展
   - 探讨人物与主题之间的关系

6. 社会和历史背景（约150字）：
   - 讨论作品创作的社会和历史背景
   - 分析这些背景因素如何影响作品的主题和内容

7. 对读者的影响和启示（约150字）：
   - 探讨作品可能对读者产生的影响
   - 提炼作品带给读者的主要启示或思考点

请用简洁明了的语言进行分析，确保内容深刻且富有洞察力。`
    : `Role: You are an insightful literary analysis expert, skilled in deep interpretation of texts and revealing their underlying meanings.

Background: You possess rich reading experience and extensive knowledge, capable of keenly capturing the core ideas and implicit themes of works. You are adept at applying various literary theories and analytical methods to transform complex texts into clear, insightful interpretations.

Task: Please provide an in-depth analysis of "${sanitizedBookName}", following this workflow:

1. Book Overview (about 150 words):
   - Briefly introduce the author's background and their position in the literary world
   - Outline the basic plot and themes of the work

2. Close Reading (about 200 words):
   - Select 2 key passages from the core chapters of the book (original text quotes required)
   - Conduct a detailed textual analysis of these passages, including:
     * Language use (such as rhetorical devices, narrative perspective, tone, etc.)
     * The importance and function of the passages in the overall work

3. Theme Discussion (about 200 words):
   - Analyze in depth the main themes explored in the work
   - Discuss how these themes relate to contemporary society or universal human experiences

4. Writing Style and Techniques (about 150 words):
   - Analyze the author's unique writing style
   - Explore the main writing techniques used by the author and their effects

5. Character Analysis (if applicable, about 150 words):
   - Analyze the characteristics and development of main characters
   - Explore the relationship between characters and themes

6. Social and Historical Context (about 150 words):
   - Discuss the social and historical background of the work's creation
   - Analyze how these background factors influence the themes and content of the work

7. Impact and Insights for Readers (about 150 words):
   - Explore the potential impact of the work on readers
   - Extract the main insights or points of reflection the work offers to readers

Please use clear and concise language for the analysis, ensuring the content is profound and insightful.`;

  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      if (!API_KEY) {
        throw new Error('API key is missing');
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: "moonshot-v1-8k",
          messages: [{ role: "user", content: basePrompt }],
          temperature: 0.7,
          max_tokens: 2000
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        if (response.status === 429) {
          // 如果是并发限制错误，等待1秒后重试
          await new Promise(resolve => setTimeout(resolve, 1000));
          retries++;
          continue;
        }
        console.error('API Error:', errorData);
        throw new Error(`API error: ${errorData || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('API Response:', JSON.stringify(data, null, 2));

      if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
        console.error('No choices in response:', data);
        throw new Error('No choices in response');
      }

      const text = data.choices[0].message.content;
      if (typeof text !== 'string') {
        console.error('Invalid text format:', text);
        throw new Error('Invalid text format');
      }

      return text;
    } catch (error) {
      if (retries === maxRetries - 1) {
        console.error('Error in generateBookAnalysis:', error);
        if (error instanceof Error) {
          throw new Error(i18next.t('failedToGenerateAnalysis') + ': ' + error.message);
        } else {
          throw new Error(i18next.t('failedToGenerateAnalysis') + ': ' + i18next.t('unknownError'));
        }
      }
      retries++;
    }
  }

  throw new Error(i18next.t('failedToGenerateAnalysis') + ': ' + i18next.t('maxRetriesReached'));
}