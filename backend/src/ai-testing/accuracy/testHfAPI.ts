import dotenv from 'dotenv';
dotenv.config();

import { InferenceClient } from '@huggingface/inference';

async function testHuggingFaceAPI() {
  try {
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    
    console.log('🔑 Testing Hugging Face API key...');
    console.log('API Key format:', apiKey ? `${apiKey.substring(0, 8)}...` : 'NOT SET');
    
    if (!apiKey) {
      throw new Error('HUGGINGFACE_API_KEY not found in environment variables');
    }
    
    if (!apiKey.startsWith('hf_')) {
      console.warn('⚠️  Warning: API key should start with "hf_"');
    }
    
    const hf = new InferenceClient(apiKey);
    
    // Test with a simple model first
    console.log('🧪 Testing API connection...');
    
    await hf.textToImage({
        provider: "replicate",
        model:"black-forest-labs/Flux.1-dev",
        inputs: "A black forest cake"
    })
    
    console.log('✅ API key is valid!');
    
    // Now test the NLI model specifically
    console.log('🧪 Testing NLI model...');
    
    const nliResult = await hf.textClassification({
      model: 'microsoft/deberta-v3-large-mnli',
      inputs: 'The sky is blue </s></s> The sky has a blue color'
    });
    
    console.log('✅ NLI model works!');
    console.log('NLI test result:', nliResult);
    
  } catch (error: any) {
    console.error('❌ API key test failed:', error.message);
    
    if (error.message.includes('Invalid username or password')) {
      console.log('\n🔧 How to fix:');
      console.log('1. Go to https://huggingface.co/settings/tokens');
      console.log('2. Create a new token');
      console.log('3. Update your .env file with: HUGGINGFACE_API_KEY=hf_your_new_token');
    }
  }
}

testHuggingFaceAPI();