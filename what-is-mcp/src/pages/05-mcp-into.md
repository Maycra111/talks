---
layout: section
background: https://images.unsplash.com/photo-1627163439134-7a8c47e08208?auto=format&q=80
---

# MCP：AI应用的"万能转接头" 🔌

<div class="text-xl opacity-80 mt-4">
假如各种AI工具是各国的人，MCP就是全球通用的交流方式
</div>

---

# 又是周一早上... 🧠

<div class="my-10">
  <BossEmployeeChat :messages="[
    { role: 'boss', content: '我听说AMD出了个MCP，好像是刚好符合我们的需求，你能实现不？' },
    { role: 'employee', content: '老板，AMD是做芯片的，MCP是Anthropic搞的AI工具标准协议...' },
    { role: 'boss', content: '不管，总之整一个！下周上线！如果做好了考虑给你涨薪100块！', type: 'warning' }
  ]" />
</div>

---

# MCP到底是啥？🤔

<div grid="~ cols-2 gap-6">
<div>

## 普通人的理解

<v-clicks>

- 🔌 AI世界的"USB接口"
- 🔄 一次开发，到处运行
- 🧩 统一不同AI应用的交流方式
- 🛠️ 编写一次工具，多处可用
- 🌉 连接所有AI助手和工具的桥梁

</v-clicks>

</div>
<div>

<div v-click class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
  <div class="flex justify-center mb-4">
    <div class="text-4xl i-carbon-integrate"></div>
  </div>

  <div class="font-medium text-lg text-center mb-4">MCP：Model Context Protocol</div>

  <div class="text-sm opacity-80 text-center">
    模型上下文协议，一个让AI应用统一调用工具、获取资源和模板的标准协议
  </div>

  <div v-click class="mt-4 text-center text-xs">
    <span class="bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">客户端 ↔️ 协议 ↔️ 服务器</span>
  </div>
</div>

<div v-click class="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded text-amber-800 dark:text-amber-200 text-sm">
  <div class="i-carbon-warning-alt inline-block mr-1"></div>
  <span class="font-medium">重要：</span> 虽然MCP包含多种功能，但其工具调用最终都会转换为LLM的Function Call格式！
</div>

</div>
</div>

---

# 理解AI工具的技术进化 🌍

<div class="grid grid-cols-2 gap-8">
<div>

## Function Call：一切的基石

<div v-click class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md mt-2 mb-4">
  <div class="text-sm">
    <div class="font-medium text-blue-600 dark:text-blue-400 mb-1">起源与本质</div>
    <div class="opacity-80">
      <div>• 由OpenAI在2023年首先提出</div>
      <div>• 现在几乎所有大模型都支持这个接口规范</div>
      <div>• 本质：让AI以结构化JSON格式调用函数</div>
    </div>
  </div>
</div>

<div v-click class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md mt-6">
  <div class="text-sm">
    <div class="font-medium text-blue-600 dark:text-blue-400 mb-1">技术演进关系</div>
    <div class="opacity-80">
      <div class="text-center font-mono my-2">
        Function Call (基础层)
        <div class="i-carbon-arrow-down mx-auto mt-1"></div>
        ChatGPT插件 (OpenAI专用)
        <div class="i-carbon-arrow-down mx-auto mt-1"></div>
        <div class="font-bold">MCP协议 (通用标准)</div>
      </div>
    </div>
  </div>
</div>

</div>
<div>

<div v-click class="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 p-5 rounded-lg shadow-lg">
  <div class="text-center font-medium mb-4">为什么需要MCP？</div>

  <div class="space-y-3 text-sm">
    <div class="flex items-start">
      <div class="bg-red-500 text-white p-1 rounded-full mr-2 mt-0.5">
        <div class="i-carbon-close-filled text-xs"></div>
      </div>
      <div><span class="line-through">每种AI有不同的插件系统</span><br><span class="text-xs opacity-70">（OpenAI、Anthropic、Cohere等都不兼容）</span></div>
    </div>
    <div class="flex items-start">
      <div class="bg-red-500 text-white p-1 rounded-full mr-2 mt-0.5">
        <div class="i-carbon-close-filled text-xs"></div>
      </div>
      <div><span class="line-through">Function Call只能做简单工具调用</span><br><span class="text-xs opacity-70">（无法提供资源、提示模板等）</span></div>
    </div>
    <div class="flex items-start">
      <div class="bg-green-500 text-white p-1 rounded-full mr-2 mt-0.5">
        <div class="i-carbon-checkmark-filled text-xs"></div>
      </div>
      <div><span class="font-medium">MCP统一了交互标准</span><br><span class="text-xs opacity-70">（一个协议兼容所有AI应用）</span></div>
    </div>
    <div class="flex items-start">
      <div class="bg-green-500 text-white p-1 rounded-full mr-2 mt-0.5">
        <div class="i-carbon-checkmark-filled text-xs"></div>
      </div>
      <div><span class="font-medium">拓展了更多高级功能</span><br><span class="text-xs opacity-70">（在Function Call基础上增加资源和提示）</span></div>
    </div>
  </div>
</div>

<div v-click class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-700 text-sm">
  <div class="flex items-start">
    <div class="i-carbon-information text-blue-500 text-xl mr-2 flex-shrink-0"></div>
    <div>
      <div class="font-medium">技术本质很简单</div>
      <div class="mt-1 opacity-80">
        MCP使用JSON-RPC作为通信协议，但其Tool功能最终会被转换为AI模型能理解的Function Call格式。MCP在此基础上增加了Resources和Prompts能力。
      </div>
    </div>
  </div>
</div>

</div>
</div>

---

# MCP的三大核心功能 🌟

<div class="mt-4 text-center">
  <div class="inline-block bg-white dark:bg-gray-800 rounded-lg px-5 py-3 shadow-md">
    <div class="text-lg font-medium">MCP在Function Call基础上扩展出三大功能</div>
  </div>
</div>

<div grid="~ cols-3 gap-8" class="mt-10">

<div v-click>
  <div class="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-lg flex items-center">
    <div class="text-6xl i-carbon-tools text-blue-500 mr-6"></div>
    <div>
      <div class="text-xl font-bold">工具 (Tools)</div>
      <div class="mt-1 opacity-80">让AI能执行具体操作，如发邮件、查天气、执行命令、调用API</div>
      <div class="mt-2 text-sm text-blue-600 dark:text-blue-400">底层使用Function Call实现，与OpenAI格式兼容</div>
    </div>
  </div>
</div>

<div v-click>
  <div class="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-lg flex items-center">
    <div class="text-6xl i-carbon-document text-green-500 mr-6"></div>
    <div>
      <div class="text-xl font-bold">资源 (Resources)</div>
      <div class="mt-1 opacity-80">给AI提供参考信息，如文件内容、数据库记录、系统状态等</div>
      <div class="mt-2 text-sm text-green-600 dark:text-green-400">MCP独有，Function Call没有此功能</div>
    </div>
  </div>
</div>

<div v-click>
  <div class="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-lg flex items-center">
    <div class="text-6xl i-carbon-chat text-purple-500 mr-6"></div>
    <div>
      <div class="text-xl font-bold">提示 (Prompts)</div>
      <div class="mt-1 opacity-80">预设的对话模板，如快捷命令、标准工作流、指导性提示等</div>
      <div class="mt-2 text-sm text-purple-600 dark:text-purple-400">MCP独有，Function Call没有此功能</div>
    </div>
  </div>
</div>

</div>

---

# Function Call格式示例

<div class="grid grid-cols-2 gap-8 mt-8">
  <div>
    <PopoverCode>
```json
// OpenAI Function Call 定义
{
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
}
```

```json
// 模型生成的调用
{
  "name": "check_weather",
  "arguments": {
    "city": "北京"
  }
}
```
  </PopoverCode>
  </div>

  <div>
    <PopoverCode>
```json
// MCP工具定义响应
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
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
}
```
    </PopoverCode>
    <div class="text-center text-sm mt-3 opacity-70">MCP工具最终也会转为Function Call格式</div>
  </div>
</div>

---

# MCP协议底层：JSON-RPC通信 🔄

<div class="text-center mb-8 mt-2">
  <div class="inline-block bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
    <div class="font-medium">MCP底层使用标准的JSON-RPC进行通信</div>
  </div>
</div>

<div class="grid grid-cols-2 gap-8">
  <div>
    <PopoverCode>
```json
// 列出工具的请求
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list"
}
```

```json
// 调用工具的请求
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "check_weather",
    "arguments": { "city": "北京" }
  }
}
```

```json
// 工具执行结果响应
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "content": [{
      "type": "text",
      "text": "北京今天晴朗，温度25°C"
    }]
  }
}
```
  </PopoverCode>
  </div>
  <div>
    <div>
      <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg shadow-sm">
        <div class="font-medium mb-2">MCP主要接口路径</div>
        <div class="grid grid-cols-1 gap-4 text-sm">
          <div>• <code>tools/list</code> - 获取可用工具</div>
          <div>• <code>tools/call</code> - 调用工具</div>
          <div>• <code>resources/list</code> - 获取可用资源</div>
          <div>• <code>resources/read</code> - 读取资源内容</div>
          <div>• <code>prompts/list</code> - 获取可用提示</div>
          <div>• <code>prompts/get</code> - 获取提示内容</div>
        </div>
      </div>
    </div>
  </div>
</div>

---

# MCP工作流程演示

<div class="flex justify-center mt-6">
  <MCPCallFlowExplainer />
</div>

---

# Function Call与MCP对比 📊

<div grid="~ cols-2 gap-10">
<div>

## Function Call

<v-clicks>

- ✅ **简单直接**：容易理解和实现
- ✅ **广泛支持**：几乎所有LLM都兼容
- ✅ **标准化结构**：JSON格式一致
- ❌ **功能单一**：只能调用函数
- ❌ **缺乏标准协议**：每家实现不完全一致
- ❌ **只支持同步调用**：缺乏事件机制

</v-clicks>

<div v-click class="mt-6 p-3 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800">
  <div class="text-amber-800 dark:text-amber-200 text-sm">
    <div class="font-medium">适用场景</div>
    <div class="mt-1 opacity-80">
      简单应用、快速原型、直接与LLM API交互
    </div>
  </div>
</div>

</div>
<div>

## MCP

<v-clicks>

- ✅ **更完整的功能**：工具、资源和提示三位一体
- ✅ **标准化协议**：JSON-RPC通信标准
- ✅ **通用性**：不绑定特定的AI模型
- ✅ **双向通信**：支持事件和通知
- ✅ **细粒度权限**：明确的控制机制
- ❌ **相对复杂**：实现和理解成本较高

</v-clicks>

<div v-click class="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
  <div class="text-blue-800 dark:text-blue-200 text-sm">
    <div class="font-medium">适用场景</div>
    <div class="mt-1 opacity-80">
      企业级应用、需要支持多种AI的产品、复杂交互场景
    </div>
  </div>
</div>

</div>
</div>

<div v-click class="mt-8 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
  <div class="font-medium">关键区别</div>
  <div class="text-sm mt-1 opacity-80">
    Function Call关注"AI如何调用函数"，而MCP关注"AI应用和工具如何交互"
  </div>
</div>

---
layout: statement
---

# 控制权之争：模型vs用户 🔍

<div class="text-2xl max-w-3xl mx-auto mb-12">
  "最关键的差异是谁掌握控制权"
</div>

<div class="grid grid-cols-2 gap-10">
  <div v-click class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
    <div class="text-center">
      <div class="i-carbon-machine-learning-model text-5xl text-blue-500 mx-auto mb-3"></div>
      <div class="font-bold mb-2 text-xl">模型控制</div>
    </div>
    <div class="mt-4 text-sm opacity-80 space-y-2">
      <div>• <b>Function Call</b>：由AI模型决定何时调用什么函数</div>
      <div>• <b>MCP工具</b>：同样由AI模型决定何时使用</div>
      <div>• 无需用户明确操作，AI自动判断</div>
      <div>• 适合自动化操作，但可能有安全风险</div>
    </div>
  </div>

  <div v-click class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
    <div class="text-center">
      <div class="i-carbon-user text-5xl text-green-500 mx-auto mb-3"></div>
      <div class="font-bold mb-2 text-xl">用户/应用控制</div>
    </div>
    <div class="mt-4 text-sm opacity-80 space-y-2">
      <div>• <b>MCP资源</b>：由用户或应用明确选择提供</div>
      <div>• <b>MCP提示</b>：由用户主动触发使用</div>
      <div>• 需要用户明确操作，AI不会自动获取</div>
      <div>• 控制权在用户手中，更安全可控</div>
    </div>
  </div>
</div>

<div v-click class="text-xl text-center mt-10 text-purple-500 font-medium">
  MCP的创新在于明确区分了由AI控制的能力和由用户控制的能力
</div>

---
layout: statement
---

# 开发者：这下我明白了！🤯

<div class="text-2xl max-w-3xl mx-auto mt-6 mb-10">
  原来MCP的本质这么简单：就是基于JSON-RPC的Function Call增强版！
</div>

<BossEmployeeChat :messages="[
  { role: 'employee', content: '老板，其实MCP本质很简单，就是基于JSON-RPC的Function Call加了标准化协议!' },
  { role: 'boss', content: '你别给我整虚的，我就问下周能不能完成？' },
]" />

<div v-click class="mt-10 text-center">
  <div class="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-bold text-xl transform transition-transform hover:scale-105 hover:rotate-1">
    <div class="flex items-center">
      <div class="i-carbon-direction-straight-right mr-2"></div>
      <div>接下来，看看实际代码怎么写！</div>
    </div>
  </div>
</div>
