#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');
const axios = require('axios');

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function readN8nConfig() {
  const envPath = path.join(os.homedir(), '.config', 'goup', 'n8n.env');

  if (!fs.existsSync(envPath)) {
    throw new Error(`Missing n8n config at ${envPath}.`);
  }

  const config = {};
  for (const rawLine of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const separatorIndex = line.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    config[key] = value;
  }

  const apiUrl = config.N8N_API_URL;
  const apiKey = config.N8N_API_KEY;

  if (!apiUrl || !apiKey) {
    throw new Error('Missing N8N_API_URL or N8N_API_KEY in ~/.config/goup/n8n.env');
  }

  return {
    baseUrl: apiUrl.replace(/\/+$/, ''),
    apiKey
  };
}

class N8NOperator {
  constructor({ baseUrl, apiKey } = {}) {
    const config = baseUrl && apiKey ? { baseUrl, apiKey } : readN8nConfig();

    this.baseUrl = config.baseUrl;
    this.apiKey = config.apiKey;
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'X-N8N-API-KEY': this.apiKey,
        Accept: 'application/json'
      },
      validateStatus: (status) => status >= 200 && status < 500
    });
  }

  redactSecrets(value) {
    const text = String(value ?? '');
    return text.replace(new RegExp(escapeRegExp(this.apiKey), 'g'), '[REDACTED]');
  }

  formatError(err) {
    if (!err) {
      return 'n8n request failed';
    }

    if (err.response) {
      const status = err.response.status;
      const payload = err.response.data;
      let message = err.response.statusText || 'Request failed';

      if (payload && typeof payload === 'object') {
        message = payload.message || payload.error || payload.details || JSON.stringify(payload);
      } else if (payload) {
        message = String(payload);
      }

      return `HTTP ${status}: ${this.redactSecrets(message)}`;
    }

    return this.redactSecrets(err.message || String(err));
  }

  async request(method, endpoint, data = undefined) {
    try {
      const response = await this.client.request({
        method,
        url: endpoint,
        ...(data !== undefined ? { data } : {})
      });

      return response.data;
    } catch (error) {
      throw new Error(this.formatError(error));
    }
  }

  list() {
    return this.request('GET', '/workflows');
  }

  get(workflowId) {
    if (!workflowId) {
      throw new Error('workflowId is required');
    }

    return this.request('GET', `/workflows/${workflowId}`);
  }

  create(workflow) {
    const payload = this.buildEditablePayload(workflow, { active: false });
    return this.request('POST', '/workflows', payload);
  }

  update(workflowId, workflow) {
    if (!workflowId) {
      throw new Error('workflowId is required');
    }

    return this.request('PUT', `/workflows/${workflowId}`, this.buildEditablePayload(workflow));
  }

  delete(workflowId) {
    if (!workflowId) {
      throw new Error('workflowId is required');
    }

    return this.request('DELETE', `/workflows/${workflowId}`);
  }

  buildEditablePayload(workflow = {}, defaults = {}) {
    const source = workflow || {};
    const payload = {
      name: source.name || defaults.name || 'Untitled Workflow',
      settings: source.settings || defaults.settings || {},
      nodes: Array.isArray(source.nodes) ? source.nodes.map((node) => ({
        id: node.id,
        name: node.name,
        type: node.type,
        typeVersion: node.typeVersion,
        position: node.position,
        parameters: node.parameters || {},
        credentials: node.credentials || {},
        disabled: Boolean(node.disabled),
        notes: node.notes || undefined
      })) : [],
      connections: source.connections || {}
    };

    if (Array.isArray(source.tags)) {
      payload.tags = source.tags;
    }

    if (source.description !== undefined && source.description !== null) {
      payload.description = source.description;
    }

    if (!source.name && !defaults.name) {
      payload.name = 'Untitled Workflow';
    }

    return payload;
  }

  static createTemporaryWorkflow(name = 'TEST - GoUP n8n Operator CLI') {
    return {
      name,
      settings: {
        executionOrder: 'v1'
      },
      nodes: [
        {
          id: 'start-node',
          name: 'Start',
          type: 'n8n-nodes-base.start',
          typeVersion: 1,
          position: [240, 300],
          parameters: {}
        }
      ],
      connections: {}
    };
  }
}

async function runCli() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command) {
    console.error('Usage: node n8n-operator.js <list|get|create|update|delete> [workflowId] [json]');
    process.exit(1);
  }

  const operator = new N8NOperator();

  try {
    switch (command) {
      case 'list': {
        const result = await operator.list();
        console.log(JSON.stringify(result, null, 2));
        return;
      }
      case 'get': {
        const workflowId = args[1];
        const result = await operator.get(workflowId);
        console.log(JSON.stringify(result, null, 2));
        return;
      }
      case 'create': {
        const rawWorkflow = args[1] ? JSON.parse(args[1]) : N8NOperator.createTemporaryWorkflow();
        const result = await operator.create(rawWorkflow);
        console.log(JSON.stringify(result, null, 2));
        return;
      }
      case 'update': {
        const workflowId = args[1];
        const rawWorkflow = args[2] ? JSON.parse(args[2]) : {};
        const result = await operator.update(workflowId, rawWorkflow);
        console.log(JSON.stringify(result, null, 2));
        return;
      }
      case 'delete': {
        const workflowId = args[1];
        const result = await operator.delete(workflowId);
        console.log(JSON.stringify(result, null, 2));
        return;
      }
      default:
        throw new Error(`Unknown command: ${command}`);
    }
  } catch (error) {
    console.error(`[n8n-operator] ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  runCli();
}

module.exports = {
  N8NOperator,
  readN8nConfig
};
