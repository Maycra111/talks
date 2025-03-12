---
layout: section
background: https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&q=80
---

# 动手实操：MCP开发入门 🛠️

<div class="text-xl opacity-80 mt-4">
理论讲完了，让我们看看如何从零开始搭建一个MCP服务器
</div>

---

# 老板的极限需求... 💼

<div class="mt-8 mb-10">
  <BossEmployeeChat :messages="[
    { role: 'boss', content: '我们要在下周发布，记住，要允许别人帮我们的聊天应用写工具！像openai搞的插件一样' },
    { role: 'employee', content: '马上，我准备接入 MCP SDK 来实现了' },
    { role: 'boss', content: '不用SDK能实现吗？直接给我最简单的代码，我们是专业公司，不能依赖别人的库！', type: 'warning' }
  ]" />
</div>

---

# 裸写MCP协议：数据结构 📋

<div class="text-center mb-6">
  <div class="inline-block bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
    <div class="font-medium">MCP使用JSON-RPC作为通信协议</div>
  </div>
</div>

<div class="grid grid-cols-2 gap-8">
  <div>
    <PopoverCode>
```json
// 基本数据格式
{
  "jsonrpc": "2.0",
  "id": "数字或字符串",
  "method": "方法名称",
  "params": {
    // 可选的参数对象
  }
}
```
```json
// 响应格式
{
  "jsonrpc": "2.0",
  "id": "与请求相同的ID",
  "result": {
    // 成功结果对象
  }
}
```
    </PopoverCode>
  </div>

  <div>
    <div class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div class="font-medium text-purple-600 dark:text-purple-400 mb-3">主要MCP方法</div>
      <div class="space-y-2 text-sm">
        <div class="flex justify-between">
          <div class="font-mono"><code>tools/list</code></div>
          <div>获取可用工具列表</div>
        </div>
        <div class="flex justify-between">
          <div class="font-mono"><code>tools/call</code></div>
          <div>调用指定工具</div>
        </div>
        <div class="flex justify-between">
          <div class="font-mono"><code>resources/list</code></div>
          <div>获取可用资源列表</div>
        </div>
        <div class="flex justify-between">
          <div class="font-mono"><code>resources/read</code></div>
          <div>读取资源内容</div>
        </div>
        <div class="flex justify-between">
          <div class="font-mono"><code>prompts/list</code></div>
          <div>获取可用提示列表</div>
        </div>
        <div class="flex justify-between">
          <div class="font-mono"><code>prompts/get</code></div>
          <div>获取提示内容</div>
        </div>
      </div>
    </div>
    <div class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
      <div class="flex items-start">
        <div class="i-carbon-information text-blue-500 text-xl mr-2 flex-shrink-0"></div>
        <div>
          <div class="font-medium">优缺点对比</div>
          <div class="mt-1 opacity-80">
            <div>• 无SDK优势：完全控制底层、无第三方依赖</div>
            <div>• SDK优势：代码更简洁、自动处理协议细节</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

---

# 裸写MCP服务器示例 👨‍💻

<div class="mt-4">
  <PopoverCode>

```javascript
// Node.js实现的最简MCP服务器
const http = require('http');

http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      const request = JSON.parse(body);
      handleMcpRequest(request, res);
    });
  }
}).listen(3000);

function handleMcpRequest(request, res) {
  const { id, method, params } = request;

  // 无SDK实现MCP协议
  if (method === 'tools/list') {
    sendResponse(res, id, {
      tools: [{
        name: "check_weather",
        description: "查询指定城市的天气",
        inputSchema: {
          type: "object",
          properties: {
            city: { type: "string" }
          },
          required: ["city"]
        }
      }]
    });
  }
  else if (method === 'tools/call') {
    // 此处调用对应的函数实现
    sendResponse(res, id, {
      content: [{
        type: 'text',
        text: `${params.arguments.city}的天气: 晴朗`
      }]
    });
  }
}

function sendResponse(res, id, result) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    jsonrpc: '2.0',
    id,
    result
  }));
}
```
  </PopoverCode>
</div>

---

# MCP工具如何对接到LLM 🔨

<div class="text-center mb-6">
  <div class="inline-block bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
    <div class="font-medium">MCP工具最终会被转换为LLM的Function Call格式</div>
  </div>
</div>

<div v-click grid="~ cols-2 gap-6">

<div class="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
  <div class="font-medium text-blue-600 dark:text-blue-400 mb-3">转换步骤</div>
  <div class="grid grid-cols-1 gap-2 text-sm">
      <div>1. 客户端向MCP服务器请求工具列表</div>
      <div>2. 将MCP工具定义转换为Function Call格式</div>
      <div>3. 发送Function Call定义给LLM</div>
      <div>4. 接收LLM生成的Function Call</div>
      <div>5. 将Function Call转为MCP工具调用</div>
      <div>6. 发送工具调用结果给LLM</div>
  </div>
</div>

<div>
  <PopoverCode>

```javascript
// 将MCP工具转换为OpenAI Function Call格式
function mcpToolsToFunctionCalls(mcpTools) {
  return mcpTools.map(tool => ({
    name: tool.name,
    description: tool.description,
    parameters: {
      ...tool.inputSchema,
      // Function Call需要type字段在顶层
      type: "object"
    }
  }));
}

// 将OpenAI Function Call调用转为MCP工具调用
function functionCallToMcpToolCall(functionCall) {
  return {
    jsonrpc: "2.0",
    id: generateRequestId(),
    method: "tools/call",
    params: {
      name: functionCall.name,
      arguments: JSON.parse(functionCall.arguments)
    }
  };
}
```
  </PopoverCode>
</div>

</div>

---

# MCP调用流程示例 🔄

<div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
  <div class="bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 text-white">
    <div class="font-medium">从MCP到LLM的完整流程</div>
  </div>

  <div class="grid grid-cols-2 gap-5 p-4">
    <div>
      <PopoverCode>
```json
// 1. MCP工具定义
{
  "tools": [{
    "name": "check_weather",
    "description": "查询指定城市的天气",
    "inputSchema": {
      "type": "object",
      "properties": {
        "city": {
          "type": "string",
          "description": "城市名称"
        }
      },
      "required": ["city"]
    }
  }]
}
```

```json
// 2. 转换为Function Call
{
  "functions": [{
    "name": "check_weather",
    "description": "查询指定城市的天气",
    "parameters": {
      "type": "object",
      "properties": {
        "city": {
          "type": "string",
          "description": "城市名称"
        }
      },
      "required": ["city"]
    }
  }]
}
```
  </PopoverCode>
    </div>
    <div>
  <PopoverCode>
```json
// 3. LLM生成的Function Call
{
  "name": "check_weather",
  "arguments": "{ \"city\": \"北京\" }"
}
```

```json
// 4. 转换为MCP工具调用
{
  "jsonrpc": "2.0",
  "id": "req-123",
  "method": "tools/call",
  "params": {
    "name": "check_weather",
    "arguments": { "city": "北京" }
  }
}
```
  </PopoverCode>
    </div>
  </div>
</div>

<div class="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded text-sm">
  <div class="i-carbon-idea text-amber-500 text-xl mr-2 inline-block"></div>
  <span>MCP工具和Function Call结构非常相似，只需简单字段映射即可转换</span>
</div>

---

# 使用SDK简化MCP开发 (TypeScript) 🚀

<div class="text-center mb-6">
  <div class="inline-block bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
    <div class="font-medium">使用官方SDK可以大幅简化MCP开发工作</div>
  </div>
</div>

<PopoverCode title="TypeScript SDK示例">

```typescript
import { Server } from "@modelcontextprotocol/sdk/server";
import { StdioServerTransport } from
  "@modelcontextprotocol/sdk/server/stdio";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema
} from "@modelcontextprotocol/sdk/types";

// 创建服务器实例
const server = new Server({
  name: "weather-server",
  version: "1.0.0"
}, {
  capabilities: {
    tools: {}  // 启用工具功能
  }
});

// 定义工具
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [{
      name: "check_weather",
      description: "查询指定城市的天气",
      inputSchema: {
        type: "object",
        properties: {
          city: { type: "string" }
        },
        required: ["city"]
      }
    }]
  };
});

// 工具调用
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "check_weather") {
    return {
      content: [{
        type: "text",
        text: `${args.city}的天气是晴朗，25℃`
      }]
    };
  }

  throw new Error(`未知工具: ${name}`);
});

// 启动服务器
const transport = new StdioServerTransport();
await server.connect(transport);
```
</PopoverCode>

---

# 使用SDK简化MCP开发 (Python) 🐍

<PopoverCode title="Python SDK示例">

```python
from mcp.server import Server
import mcp.types as types
from mcp.server.stdio import stdio_server
import asyncio

# 创建MCP服务器
app = Server("weather-server")

# 定义可用工具
@app.list_tools()
async def list_tools() -> list[types.Tool]:
    return [
        types.Tool(
            name="check_weather",
            description="查询指定城市的天气",
            inputSchema={
                "type": "object",
                "properties": {
                    "city": {"type": "string"},
                },
                "required": ["city"]
            }
        )
    ]

# 处理工具调用
@app.call_tool()
async def call_tool(
    name: str,
    arguments: dict
) -> list[types.TextContent]:
    if name == "check_weather":
        city = arguments["city"]
        return [types.TextContent(
            type="text",
            text=f"{city}的天气是晴朗，25℃"
        )]
    else:
        raise ValueError(f"未知工具: {name}")

# 主函数启动服务器
async def main():
    async with stdio_server() as streams:
        await app.run(
            streams[0],
            streams[1],
            app.create_initialization_options()
        )

if __name__ == "__main__":
    asyncio.run(main())
```
</PopoverCode>

<div class="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded text-sm">
  <div class="flex items-start">
    <div class="i-carbon-checkmark text-green-500 text-xl mr-2 flex-shrink-0"></div>
    <div>
      <div class="font-medium">SDK主要优势</div>
      <div class="mt-2">
        <div class="grid grid-cols-2 gap-3 opacity-80">
          <div>✅ 自动处理JSON-RPC细节</div>
          <div>✅ 类型安全（TypeScript）</div>
          <div>✅ 内置错误处理机制</div>
          <div>✅ 支持多种传输方式</div>
        </div>
        <div class="mt-1 opacity-80">✅ 遵循最佳实践，降低开发难度</div>
      </div>
    </div>
  </div>
</div>

---
layout: statement
---

# 总结：MCP没那么复杂 📈

<div class="text-2xl max-w-3xl mx-auto mt-6 mb-8">
  本质上就是给Function Call加了标准化协议和更多功能
</div>

<div class="grid grid-cols-3 gap-6 mt-12">
  <div class="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-lg text-center">
    <div class="text-4xl i-carbon-function text-blue-500 mx-auto mb-4"></div>
    <div class="font-bold mb-2">Function Call</div>
    <div class="text-sm opacity-80">单一AI模型的简单工具调用</div>
    <div class="mt-4 text-xs bg-blue-50 dark:bg-blue-900/20 rounded p-2">
      基础: MCP工具最终转为此格式
    </div>
  </div>
  <div class="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-lg text-center">
    <div class="text-4xl i-carbon-json text-green-500 mx-auto mb-4"></div>
    <div class="font-bold mb-2">JSON-RPC</div>
    <div class="text-sm opacity-80">标准化通信协议</div>
    <div class="mt-4 text-xs bg-green-50 dark:bg-green-900/20 rounded p-2">
      核心: MCP的消息传递基础
    </div>
  </div>
  <div class="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-lg text-center transform scale-110 z-10 border-2 border-blue-300 dark:border-blue-700">
    <div class="text-4xl i-carbon-network-4 text-purple-500 mx-auto mb-4"></div>
    <div class="font-bold mb-2">MCP协议</div>
    <div class="text-sm opacity-80">开放生态的通用标准</div>
    <div class="mt-4 text-xs bg-purple-50 dark:bg-purple-900/20 rounded p-2">
      创新: 资源和提示功能
    </div>
  </div>
</div>

<div class="mt-10 text-center">
  <div class="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-bold text-xl transform hover:scale-105 transition-all hover:rotate-1">
    <div class="flex items-center">
      <div class="i-carbon-rocket mr-2"></div>
      <div>理解了原理，自己也能实现MCP！</div>
    </div>
  </div>
</div>

---
layout: statement
---

# MCP 接入上线了 😎

<div class="mt-4 mb-8">
  <BossEmployeeChat :messages="[
    { role: 'boss', content: '这个 M 什么 CP真不错，用户好像很喜欢！' },
    { role: 'boss', content: '投资人准备追加投资，干得不错！' },
    { role: 'employee', content: '那老板，涨薪的事...', type: 'warning' },
    { role: 'boss', content: '涨薪？你小子放心，我已经叫财务给你加50块了！' }
  ]" />
</div>

---
layout: end
---

# 你已准备好进入MCP时代！

<div class="text-xl opacity-80 mb-8">
  一次开发，到处运行的AI工具新标准
</div>

<div class="grid grid-cols-3 gap-8">
  <div class="text-center">
    <div class="h-14 w-14 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-200 mx-auto mb-4">
      <div class="i-carbon-document text-2xl"></div>
    </div>
    <div class="font-medium mb-1">官方文档</div>
    <div class="text-sm opacity-70">modelcontextprotocol.io</div>
  </div>

  <div class="text-center">
    <div class="h-14 w-14 bg-purple-100 dark:bg-purple-800 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-200 mx-auto mb-4">
      <div class="i-carbon-code text-2xl"></div>
    </div>
    <div class="font-medium mb-1">开发者资源</div>
    <div class="text-sm opacity-70">github.com/modelcontextprotocol</div>
  </div>

  <div class="text-center">
    <div class="h-14 w-14 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center text-green-600 dark:text-green-200 mx-auto mb-4">
      <div class="i-carbon-chat text-2xl"></div>
    </div>
    <div class="font-medium mb-1">演讲者</div>
    <div class="text-sm opacity-70">github.com/2214962083</div>
  </div>
</div>

<div class="mt-12 text-center text-sm opacity-60">
  迎接AI工具生态的新时代 | 2025
</div>
