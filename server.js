#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} = require('@modelcontextprotocol/sdk/types.js');

class HuggingFaceMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'huggingface-mcp-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.hfToken = process.env.HF_TOKEN;
    this.baseUrl = 'https://huggingface.co';
    this.apiUrl = 'https://api-inference.huggingface.co';

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'search_models',
            description: 'Search for models on Hugging Face Hub',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query for models',
                },
                task: {
                  type: 'string',
                  description: 'Filter by task (e.g., text-generation, image-classification)',
                },
                sort: {
                  type: 'string',
                  description: 'Sort by: downloads, likes, or lastModified',
                  enum: ['downloads', 'likes', 'lastModified'],
                },
                limit: {
                  type: 'number',
                  description: 'Number of results to return (max 100)',
                  default: 10,
                },
              },
              required: ['query'],
            },
          },
          {
            name: 'search_datasets',
            description: 'Search for datasets on Hugging Face Hub',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query for datasets',
                },
                task: {
                  type: 'string',
                  description: 'Filter by task category',
                },
                limit: {
                  type: 'number',
                  description: 'Number of results to return (max 100)',
                  default: 10,
                },
              },
              required: ['query'],
            },
          },
          {
            name: 'get_model_info',
            description: 'Get detailed information about a specific model',
            inputSchema: {
              type: 'object',
              properties: {
                model_id: {
                  type: 'string',
                  description: 'Model ID (e.g., "microsoft/DialoGPT-medium")',
                },
              },
              required: ['model_id'],
            },
          },
          {
            name: 'inference_text_generation',
            description: 'Generate text using a Hugging Face model',
            inputSchema: {
              type: 'object',
              properties: {
                model_id: {
                  type: 'string',
                  description: 'Model ID for text generation',
                },
                inputs: {
                  type: 'string',
                  description: 'Input text prompt',
                },
                parameters: {
                  type: 'object',
                  description: 'Generation parameters',
                  properties: {
                    max_length: { type: 'number' },
                    temperature: { type: 'number' },
                    top_p: { type: 'number' },
                    do_sample: { type: 'boolean' },
                  },
                },
              },
              required: ['model_id', 'inputs'],
            },
          },
          {
            name: 'inference_image_classification',
            description: 'Classify an image using a Hugging Face model',
            inputSchema: {
              type: 'object',
              properties: {
                model_id: {
                  type: 'string',
                  description: 'Model ID for image classification',
                },
                image_url: {
                  type: 'string',
                  description: 'URL of the image to classify',
                },
              },
              required: ['model_id', 'image_url'],
            },
          },
          {
            name: 'list_spaces',
            description: 'Search for Hugging Face Spaces',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query for spaces',
                },
                limit: {
                  type: 'number',
                  description: 'Number of results to return',
                  default: 10,
                },
              },
              required: ['query'],
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'search_models':
            return await this.searchModels(args);
          case 'search_datasets':
            return await this.searchDatasets(args);
          case 'get_model_info':
            return await this.getModelInfo(args);
          case 'inference_text_generation':
            return await this.inferenceTextGeneration(args);
          case 'inference_image_classification':
            return await this.inferenceImageClassification(args);
          case 'list_spaces':
            return await this.listSpaces(args);
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        throw new McpError(
          ErrorCode.InternalError,
          `Error executing ${name}: ${error.message}`
        );
      }
    });
  }

  async makeHubRequest(endpoint, params = {}) {
    const url = new URL(endpoint, this.baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.append(key, value.toString());
    });

    const headers = {};
    if (this.hfToken) {
      headers['Authorization'] = `Bearer ${this.hfToken}`;
    }

    const response = await fetch(url.toString(), { headers });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  async makeInferenceRequest(modelId, payload) {
    if (!this.hfToken) {
      throw new Error('HF_TOKEN is required for inference requests');
    }

    const response = await fetch(`${this.apiUrl}/models/${modelId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.hfToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Inference failed: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  async searchModels(args) {
    const { query, task, sort = 'downloads', limit = 10 } = args;
    
    const params = {
      search: query,
      limit: Math.min(limit, 100),
      sort,
    };
    
    if (task) params.pipeline_tag = task;

    const data = await this.makeHubRequest('/api/models', params);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            results: data.slice(0, limit).map(model => ({
              id: model.id || model.modelId,
              author: model.author,
              downloads: model.downloads,
              likes: model.likes,
              tags: model.tags,
              pipeline_tag: model.pipeline_tag,
              library_name: model.library_name,
              created_at: model.createdAt,
              updated_at: model.lastModified,
            })),
            total_found: data.length,
          }, null, 2),
        },
      ],
    };
  }

  async searchDatasets(args) {
    const { query, task, limit = 10 } = args;
    
    const params = {
      search: query,
      limit: Math.min(limit, 100),
    };
    
    if (task) params.task_categories = task;

    const data = await this.makeHubRequest('/api/datasets', params);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            results: data.slice(0, limit).map(dataset => ({
              id: dataset.id,
              author: dataset.author,
              downloads: dataset.downloads,
              likes: dataset.likes,
              tags: dataset.tags,
              task_categories: dataset.task_categories,
              created_at: dataset.createdAt,
              updated_at: dataset.lastModified,
            })),
            total_found: data.length,
          }, null, 2),
        },
      ],
    };
  }

  async getModelInfo(args) {
    const { model_id } = args;
    
    const data = await this.makeHubRequest(`/api/models/${model_id}`);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            id: data.id,
            author: data.author,
            sha: data.sha,
            downloads: data.downloads,
            likes: data.likes,
            library_name: data.library_name,
            tags: data.tags,
            pipeline_tag: data.pipeline_tag,
            mask_token: data.mask_token,
            widget_data: data.widgetData,
            model_index: data.model_index,
            config: data.config,
            created_at: data.createdAt,
            updated_at: data.lastModified,
            card_data: data.cardData,
            siblings: data.siblings?.map(s => s.rfilename),
          }, null, 2),
        },
      ],
    };
  }

  async inferenceTextGeneration(args) {
    const { model_id, inputs, parameters = {} } = args;
    
    const payload = {
      inputs,
      parameters: {
        max_length: 100,
        temperature: 0.7,
        ...parameters,
      },
    };

    const result = await this.makeInferenceRequest(model_id, payload);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            model: model_id,
            generated_text: Array.isArray(result) ? result[0]?.generated_text : result.generated_text,
            full_response: result,
          }, null, 2),
        },
      ],
    };
  }

  async inferenceImageClassification(args) {
    const { model_id, image_url } = args;
    
    // Fetch image and convert to base64
    const imageResponse = await fetch(image_url);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }
    
    const imageBuffer = await imageResponse.arrayBuffer();
    const result = await this.makeInferenceRequest(model_id, imageBuffer);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            model: model_id,
            predictions: result.map(pred => ({
              label: pred.label,
              score: pred.score,
            })),
          }, null, 2),
        },
      ],
    };
  }

  async listSpaces(args) {
    const { query, limit = 10 } = args;
    
    const params = {
      search: query,
      limit: Math.min(limit, 100),
    };

    const data = await this.makeHubRequest('/api/spaces', params);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            results: data.slice(0, limit).map(space => ({
              id: space.id,
              author: space.author,
              title: space.title,
              likes: space.likes,
              stage: space.stage,
              tags: space.tags,
              sdk: space.sdk,
              created_at: space.createdAt,
              updated_at: space.lastModified,
            })),
            total_found: data.length,
          }, null, 2),
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Hugging Face MCP server running on stdio');
  }
}

// Run the server
if (require.main === module) {
  const server = new HuggingFaceMCPServer();
  server.run().catch((error) => {
    console.error('Server error:', error);
    process.exit(1);
  });
}

module.exports = HuggingFaceMCPServer;