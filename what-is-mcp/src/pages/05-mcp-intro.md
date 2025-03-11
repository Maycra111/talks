---
layout: section
background: https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&q=80
---

# MCP: 模型上下文协议

<div class="text-xl opacity-80 mt-4">
一次开发，到处运行的未来标准
</div>

---
layout: statement
---

# 周五下午，紧急会议... 🚨

<div class="text-xl max-w-3xl mx-auto my-8">
老板一脸严肃："我和投资人刚通完电话，他们想看我们的'全能AI聊天应用战略'..."
</div>

<div class="text-3xl font-bold text-amber-500 mt-4">
  "周一董事会，我需要展示一个我们AI聊天应用啥都能干的方案！"
</div>

<div class="max-w-2xl mx-auto mt-10 text-xl">
  <div class="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
    "你来搞定！"
  </div>
</div>

---

# MCP是什么？超简单解释

<div grid="~ cols-2 gap-8">
<div>

## 想象一下...

<v-clicks>

- 🔌 **通用电源插座** - 不同电器都能用同一个插座
- 🌐 **USB接口** - 任何USB设备都能连接电脑
- 🚗 **汽车加油口** - 所有加油站都能给车加油

</v-clicks>

<div v-click class="mt-6 p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-blue-800 dark:text-blue-200">
<carbon-idea class="inline-block mr-2" /> <span class="font-bold">MCP就是AI工具的"通用接口"</span>：一种标准化协议，让AI工具能在任何支持MCP的AI应用中运行！
</div>

<div v-click class="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md mt-6">
  <div class="font-medium mb-2">MCP = 模型上下文协议</div>
  <div class="text-sm opacity-80">
    由Anthropic(Claude开发公司)提出的开放标准，目标是统一AI应用与工具之间的沟通方式。
  </div>
</div>

</div>
<div v-click>

<MCPFlowComparison />

<div class="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg mt-4 text-amber-800 dark:text-amber-200 text-sm">
  <div class="flex items-start">
    <div class="i-carbon-warning-alt mt-1 mr-2 flex-shrink-0"></div>
    <div>
      <span class="font-medium">现状问题：</span>目前每个AI平台都需要自己的工具开发方式，开发者疲于应付，用户也无法跨平台使用喜欢的工具。
    </div>
  </div>
</div>

</div>
</div>

---

# MCP怎么解决问题？

<div grid="~ cols-2 gap-8">
<div>

## 核心原理：客户端-服务器模式

<v-clicks>

- 🧩 **MCP服务器** - 提供工具功能的服务器
  - 类似小餐馆，提供特定菜品
  - 可以是天气查询、计算器、网络搜索等

- 🖥️ **MCP客户端** - 支持MCP协议的AI应用
  - 类似顾客，想要使用不同餐馆的服务
  - 可以是ChatGPT、Claude、你的应用等

- 🤝 **标准交流** - 使用相同的"语言"沟通
  - 所有餐馆使用同一种菜单格式
  - 客户端发送请求，服务器执行并返回结果

</v-clicks>

</div>
<div v-click>

## 一次编写，到处运行

<div class="space-y-4 mt-4">

<div class="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
  <div class="font-medium mb-1 text-blue-600 dark:text-blue-300 flex items-center">
    <div class="i-carbon-application-web text-lg mr-2"></div>
    开发者体验
  </div>
  <div class="text-sm">
    编写一次MCP服务器代码，它就能被所有支持MCP的AI应用使用，无需根据平台修改代码。
  </div>
</div>

<div class="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
  <div class="font-medium mb-1 text-green-600 dark:text-green-300 flex items-center">
    <div class="i-carbon-user-avatar text-lg mr-2"></div>
    用户体验
  </div>
  <div class="text-sm">
    用户在任何支持MCP的AI应用中都能使用他们喜欢的工具，不会被锁定在单一平台。
  </div>
</div>

<div class="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
  <div class="font-medium mb-1 text-purple-600 dark:text-purple-300 flex items-center">
    <div class="i-carbon-earth text-lg mr-2"></div>
    生态系统
  </div>
  <div class="text-sm">
    创建一个开放、标准化的AI工具生态系统，促进创新和竞争，避免生态碎片化。
  </div>
</div>

</div>

</div>
</div>

---

# MCP如何工作？一图看懂

<div class="flex justify-center mb-4">
  <MCPCallFlowExplainer />
</div>

<div v-click class="mt-4 text-center">
  <div class="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-blue-800 dark:text-blue-200 text-sm">
    <div class="flex items-center">
      <div class="i-carbon-idea text-lg mr-2"></div>
      <div>MCP让工具可以在<span class="font-bold">任何支持该协议的AI应用</span>中使用，而不仅限于特定平台！</div>
    </div>
  </div>
</div>

---

# MCP的两大核心组件

<div grid="~ cols-2 gap-6">
<div>

## 1. 资源 (Resources)

<v-clicks>

- 📄 **简单理解**：类似一个虚拟文件夹
- 🔍 **实际例子**：
  - 用户的文件
  - 网页内容
- 🔑 **关键特点**：
  - 通过URI标识（类似URL）
  - AI可以阅读、修改
  - 需要用户许可才能操作

</v-clicks>

<div v-click class="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm mt-4 text-sm">
<div class="font-mono text-xs">
```javascript
// 读取资源示例
const fileTextData = await mcpClient.readResource(
  'file://study/japanese-notes.txt'
)
```
</div>
</div>

</div>
<div>

## 2. 工具 (Tools)

<v-clicks>

- 🛠️ **简单理解**：可执行的工具
- 📋 **实际例子**：
  - 计算器
  - 天气查询
  - 网页搜索
  - 文件操作
- 🔑 **关键特点**：
  - 有名称、描述和参数规范
  - 由AI模型决定何时调用
  - 通常需要用户确认才执行
  - 执行后返回结果给AI

</v-clicks>

<div v-click class="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm mt-4 text-sm">
<div class="font-mono text-xs">
```javascript
// 定义工具示例
const weatherTool = {
  name: 'getWeather',
  description: '获取指定城市的天气',
  parameters: {
    properties: { city: { type: 'string' } },
    required: ['city']
  }
}
```
</div>
</div>

</div>
</div>

<div v-click class="mt-4 p-3 bg-green-100 dark:bg-green-900/20 rounded-lg text-green-800 dark:text-green-200">
  <div class="flex items-center">
    <div class="i-carbon-thumbs-up text-xl mr-2"></div>
    <div>老板看到这个图解眼前一亮："这太直观了！简单清晰，我终于理解了！"</div>
  </div>
</div>

---

# 如何开发MCP服务器？超简单示例

<div grid="~ cols-2 gap-6">
<div v-click>

## 天气查询MCP服务器

```javascript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const NWS_API_BASE = "https://api.weather.gov";
const USER_AGENT = "weather-app/1.0";

// Create server instance
const server = new McpServer({
  name: "weather",
  version: "1.0.0",
});

// Register weather tools
server.tool(
  "get-alerts",
  "Get weather alerts for a state",
  {
    state: z.string().length(2).describe("Two-letter state code (e.g. CA, NY)"),
  },
  async ({ state }) => {
    const stateCode = state.toUpperCase();
    const alertsUrl = `${NWS_API_BASE}/alerts?area=${stateCode}`;
    const alertsData = await makeNWSRequest<AlertsResponse>(alertsUrl);

    if (!alertsData) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to retrieve alerts data",
          },
        ],
      };
    }

    const features = alertsData.features || [];
    if (features.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `No active alerts for ${stateCode}`,
          },
        ],
      };
    }

    const formattedAlerts = features.map(formatAlert);
    const alertsText = `Active alerts for ${stateCode}:\n\n${formattedAlerts.join("\n")}`;

    return {
      content: [
        {
          type: "text",
          text: alertsText,
        },
      ],
    };
  },
);
```

</div>
<div>

## 常见MCP应用场景

<div v-click class="grid grid-cols-2 gap-3 mt-4">
  <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
    <div class="font-medium text-blue-800 dark:text-blue-200 mb-1">本地文件访问</div>
    <div class="text-xs">安全访问用户文件、读写内容，处理各种格式</div>
  </div>
  <div class="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
    <div class="font-medium text-green-800 dark:text-green-200 mb-1">数据库操作</div>
    <div class="text-xs">连接数据库，执行查询，分析结果</div>
  </div>
  <div class="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
    <div class="font-medium text-purple-800 dark:text-purple-200 mb-1">网络搜索</div>
    <div class="text-xs">实时获取网络信息，返回搜索结果</div>
  </div>
  <div class="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
    <div class="font-medium text-amber-800 dark:text-amber-200 mb-1">代码执行</div>
    <div class="text-xs">安全执行用户代码，返回结果</div>
  </div>
</div>

<div v-click class="mt-4">
  <div class="font-medium mb-2">已支持的客户端应用</div>
  <div class="flex flex-wrap gap-2">
    <div class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">Claude</div>
    <div class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">Cursor</div>
    <div class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">Continue</div>
    <div class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">...</div>
    <div class="px-2 py-1 bg-green-100 dark:bg-green-700 rounded-full text-xs font-medium">我们的应用</div>
  </div>
</div>

<div v-click class="mt-6 p-3 bg-green-100 dark:bg-green-900/20 rounded-lg text-green-800 dark:text-green-200">
  <div class="flex items-center">
    <div class="i-carbon-checkmark-outline text-lg mr-2"></div>
    <div class="text-sm">
      最精彩的部分：不必为每个平台编写不同代码，<span class="font-bold">一次开发，到处运行！</span>
    </div>
  </div>
</div>

</div>
</div>

---
layout: statement
---

# 周一董事会演讲日 🎯

<div class="text-2xl mt-8 max-w-3xl mx-auto">
你帮老板准备了一份出色的PPT，详细展示了接入 MCP 后的 AI 聊天应用如何有<span class="text-green-500 font-bold">超能力</span>
</div>

<div class="text-xl mt-8 max-w-2xl mx-auto opacity-80">
精心设计的图表、清晰的例子和未来发展规划，赢得了董事会成员的一致好评
</div>

<div v-click class="mt-10 flex justify-center items-center">
  <div class="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-lg max-w-lg">
    <div class="flex mb-4">
      <div class="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
        <div class="i-carbon-face-wink text-2xl"></div>
      </div>
      <div class="ml-4">
        <div class="font-bold text-lg">老板</div>
        <div class="text-xs text-gray-500">下午 4:32</div>
      </div>
    </div>
    <div class="text-lg mb-3">
      董事会非常满意，投资人说我们适配 MCP 战略非常前瞻！
    </div>
    <div class="text-lg font-bold">
      下周一我们讨论你的升职加薪方案！☕
    </div>
  </div>
</div>

---
layout: end
---

# 谢谢观看！

<div class="text-xl opacity-80 mb-8">
  开启你的MCP开发之旅，成为AI能力扩展的先行者
</div>

<div class="grid grid-cols-3 gap-8">
  <div class="text-center">
    <div class="h-14 w-14 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-200 mx-auto mb-4">
      <div class="i-carbon-document text-2xl"></div>
    </div>
    <div class="font-medium mb-1">MCP文档</div>
    <div class="text-sm opacity-70">modelcontextprotocol.io</div>
  </div>

  <div class="text-center">
    <div class="h-14 w-14 bg-purple-100 dark:bg-purple-800 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-200 mx-auto mb-4">
      <div class="i-carbon-code text-2xl"></div>
    </div>
    <div class="font-medium mb-1">MCP SDK</div>
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
  从开发者角度理解 MCP 协议 | 2025
</div>
