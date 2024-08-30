import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';

export const extractMeasure = async (fileName: string, filePath: string): Promise<string> => {
  const geminiApiKey = <string>process.env.GEMINI_API_KEY;
  const fileManager = new GoogleAIFileManager(geminiApiKey);
  const genAI = new GoogleGenerativeAI(geminiApiKey);
  const modelAI = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt =
    'Return the reading of the water or gas meter, no zeros on the left, formatting the answer only with numbers';

  // Upload image to Google AI file manager
  const uploadResponse = await fileManager.uploadFile(filePath, {
    mimeType: 'image/jpeg',
    displayName: fileName,
  });

  // Extracts measure reading via Gemini AI
  const result = await modelAI.generateContent([
    {
      fileData: {
        mimeType: uploadResponse.file.mimeType,
        fileUri: uploadResponse.file.uri,
      },
    },
    {
      text: prompt,
    },
  ]);

  const extractedMeasure = result.response.text();

  // const list = await fileManager.listFiles();
  // for (let file of list.files) {
  //   await fileManager.deleteFile(file.name);
  // }

  return extractedMeasure;
};
