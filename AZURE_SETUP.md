# Azure AI Integration Setup Guide

This guide will help you connect your Azure AI Foundry agent to the StoreAI chat interface.

## Prerequisites

- An Azure account with an Azure AI Foundry resource
- A deployed AI model/agent in Azure AI Foundry
- Your Azure AI credentials (endpoint, API key, deployment name)

## Configuration Steps

### 1. Locate Your Azure AI Credentials

From your Azure AI Foundry portal:

1. Navigate to your Azure AI resource
2. Go to **Keys and Endpoint** section
3. Copy the following information:
   - **Endpoint URL** (e.g., `https://your-resource.openai.azure.com`)
   - **API Key** (Key 1 or Key 2)
   - **Deployment Name** (the name you gave your model deployment)

### 2. Configure the Application

Open the file: `src/lib/azure-ai-config.ts`

Replace the empty strings with your Azure AI credentials:

```typescript
export const AZURE_AI_CONFIG = {
  // Your Azure AI endpoint URL
  endpoint: 'https://your-resource.openai.azure.com',
  
  // Your Azure AI API key
  apiKey: 'your-api-key-here',
  
  // Your deployment name (e.g., 'gpt-4', 'gpt-35-turbo')
  deploymentName: 'your-deployment-name',
  
  // API version (usually keep as default)
  apiVersion: '2024-02-15-preview'
}
```

### 3. Example Configuration

Here's what a properly configured file looks like:

```typescript
export const AZURE_AI_CONFIG = {
  endpoint: 'https://storeai-eastus.openai.azure.com',
  apiKey: 'abc123def456ghi789jkl012mno345pqr678stu',
  deploymentName: 'gpt-4-turbo',
  apiVersion: '2024-02-15-preview'
}
```

## Testing the Integration

1. Save your changes to `azure-ai-config.ts`
2. The app will automatically reload
3. Click the **"AI Agents Active"** button in the top-right corner
4. A chat window will appear in the bottom-right corner
5. Type a message and press Enter
6. You should receive a response from your Azure AI agent

## Troubleshooting

### Error: "Azure AI configuration is incomplete"
- Make sure all fields in `azure-ai-config.ts` are filled in
- Check that there are no extra spaces or quotes

### Error: "Failed to get AI response"
- Verify your API key is correct and active
- Ensure your endpoint URL includes `https://` and doesn't have a trailing slash
- Check that your deployment name matches exactly what's in Azure
- Verify your Azure resource has available quota

### Authentication Issues
- Try regenerating your API key in Azure portal
- Ensure you're using the correct key (Key 1 or Key 2)
- Check that your Azure subscription is active

### Network Issues
- If behind a corporate firewall, ensure Azure endpoints are whitelisted
- Check browser console for CORS or network errors

## API Version Notes

The default API version is `2024-02-15-preview`. If you need to use a different version:

- Check Azure documentation for available versions
- Update the `apiVersion` field in the config file
- Common versions:
  - `2024-02-15-preview` (recommended)
  - `2023-05-15`
  - `2023-03-15-preview`

## Security Best Practices

⚠️ **Important Security Notes:**

1. **Never commit API keys to version control**
   - Add `azure-ai-config.ts` to `.gitignore` if sharing this code
   - Consider using environment variables for production

2. **Rotate keys regularly**
   - Azure allows you to have two keys for zero-downtime rotation

3. **Use managed identities when possible**
   - For production deployments, consider Azure Managed Identity instead of API keys

4. **Monitor usage**
   - Keep track of API calls in Azure portal
   - Set up budget alerts to avoid unexpected costs

## Advanced Configuration

### Custom System Prompt

To customize the AI assistant's behavior, edit the system prompt in `src/components/AIChatWindow.tsx`:

```typescript
messages: [
  {
    role: 'system',
    content: 'Your custom system prompt here...'
  },
  ...conversationHistory
]
```

### Adjusting AI Parameters

In `AIChatWindow.tsx`, you can modify:

- `max_tokens`: Maximum response length (default: 800)
- `temperature`: Creativity level 0-1 (default: 0.7)
- `top_p`: Sampling threshold (default: 0.95)

## Support

For Azure-specific issues:
- [Azure AI Documentation](https://learn.microsoft.com/en-us/azure/ai-services/)
- [Azure Support Portal](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade)

For application issues:
- Check the browser console for error messages
- Review the Network tab to see API requests/responses
