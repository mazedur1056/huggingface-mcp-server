# Hugging Face MCP Server

A custom Model Context Protocol (MCP) server that provides seamless integration between Cursor (or any MCP-compatible client) and Hugging Face Hub.

## Features

- **Model Search**: Search and discover models on Hugging Face Hub
- **Dataset Search**: Find and explore datasets
- **Model Information**: Get detailed information about specific models
- **Inference**: Run text generation and image classification directly
- **Spaces**: Search and discover Hugging Face Spaces
- **Authentication**: Secure API access with your Hugging Face token

## Installation
You need to have Git and Node.js installed on your system.

### 1. Clone the repository

```bash
git clone https://github.com/mazedur1056/huggingface-mcp-server.git
cd huggingface-mcp-server
```
Or in windows, you can navigate to the cloned repository using file explorer. Open command prompt in the folder.

### 2. Install Dependencies

```bash
npm install
```

### 3. Make the Server Executable (Unix/Linux/macOS only)

```bash
chmod +x server.js
```
Note: This step is only necessary on Unix-like systems (Linux, macOS). Windows users can skip this step.

### 4. Install Globally (Optional | Unix/Linux/macOS only)

```bash
npm install -g .
```

## Configuration

### 1. Get Your Hugging Face Token

1. Go to [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Create a new token with read permissions
3. Copy the token for use in configuration

### 2. Configure Cursor

Add this configuration to your Cursor MCP settings (usually in `~/.cursor/mcp_config.json` or through Cursor's settings):

```json
{
  "mcpServers": {
    "huggingface": {
      "command": "node",
      "args": ["/path/to/your/huggingface-mcp-server/server.js"],
      "env": {
        "HF_TOKEN": "your_hugging_face_token_here"
      }
    }
  }
}
```

Or if installed globally:

```json
{
  "mcpServers": {
    "huggingface": {
      "command": "huggingface-mcp-server",
      "env": {
        "HF_TOKEN": "your_hugging_face_token_here"
      }
    }
  }
}
```

## Available Tools

### 1. search_models
Search for models on Hugging Face Hub.

**Parameters:**
- `query` (required): Search query
- `task` (optional): Filter by task (e.g., "text-generation", "image-classification")
- `sort` (optional): Sort by "downloads", "likes", or "lastModified"
- `limit` (optional): Number of results (default: 10, max: 100)

**Example:**
```
Search for text generation models related to "gpt"
```

### 2. search_datasets
Search for datasets on Hugging Face Hub.

**Parameters:**
- `query` (required): Search query
- `task` (optional): Filter by task category
- `limit` (optional): Number of results (default: 10, max: 100)

**Example:**
```
Search for datasets related to "sentiment analysis"
```

### 3. get_model_info
Get detailed information about a specific model.

**Parameters:**
- `model_id` (required): Model ID (e.g., "microsoft/DialoGPT-medium")

**Example:**
```
Get information about the model "microsoft/DialoGPT-medium"
```

### 4. inference_text_generation
Generate text using a Hugging Face model.

**Parameters:**
- `model_id` (required): Model ID for text generation
- `inputs` (required): Input text prompt
- `parameters` (optional): Generation parameters (max_length, temperature, top_p, do_sample)

**Example:**
```
Generate text using "gpt2" with the prompt "The future of AI is"
```

### 5. inference_image_classification
Classify an image using a Hugging Face model.

**Parameters:**
- `model_id` (required): Model ID for image classification
- `image_url` (required): URL of the image to classify

**Example:**
```
Classify an image using "google/vit-base-patch16-224"
```

### 6. list_spaces
Search for Hugging Face Spaces.

**Parameters:**
- `query` (required): Search query
- `limit` (optional): Number of results (default: 10)

**Example:**
```
Search for spaces related to "chatbot"
```

## Usage Examples

Once configured in Cursor, you can use natural language to interact with Hugging Face:

1. **"Search for the most popular text generation models"**
2. **"Get information about the BERT base model"**
3. **"Generate text using GPT-2 with the prompt 'Hello world'"**
4. **"Find datasets for sentiment analysis"**
5. **"Show me Gradio spaces for image generation"**

## Environment Variables

- `HF_TOKEN`: Your Hugging Face API token (required for inference, optional for search)

## Troubleshooting

### Common Issues

1. **"HF_TOKEN is required"**: Make sure you've set your Hugging Face token in the environment variables.

2. **"Module not found"**: Ensure you've run `npm install` in the server directory.

3. **"Permission denied"**: Make sure the server.js file is executable (`chmod +x server.js`).

4. **"Connection refused"**: Check that the path to server.js is correct in your Cursor configuration.

### Testing the Server

You can test the server independently:

```bash
# Set your token
export HF_TOKEN="your_token_here"

# Run the server
node server.js
```

The server should output: "Hugging Face MCP server running on stdio"

## Security Notes

- Never commit your Hugging Face token to version control
- Use environment variables or secure configuration management
- The token is only used for API authentication with Hugging Face

## Contributing

Feel free to extend this server with additional Hugging Face API endpoints:
- Model training status
- Space deployment
- Paper search
- Community features

## License

MIT License - feel free to modify and distribute as needed.