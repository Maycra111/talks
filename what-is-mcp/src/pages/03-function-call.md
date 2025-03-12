---
layout: section
background: https://images.unsplash.com/photo-1549116941-c00923a31c10?auto=format&q=80
---

# Function Calling: OpenAI官方救星

<div class="text-xl opacity-80 mt-4">
OpenAI说："别再折腾提示工程了，用这个吧！"
</div>

---

# Function Calling: 革命性的功能！

<div grid="~ cols-2 gap-6">
<div>

## 什么是Function Calling?

<v-clicks>

- 🔧 **直接告诉模型**你有哪些工具可用
- 📋 提供函数名称、描述和**参数规范**
- 🧠 模型自动决定何时调用哪个函数
- ✅ 自动生成符合格式的**参数JSON**
- 🔄 API自动解析，无需手动提取

</v-clicks>

<div v-click class="mt-6 p-3 bg-green-100 dark:bg-green-900/20 rounded-lg text-green-800 dark:text-green-200">
<carbon-checkmark-outline class="inline-block mr-2" /> 就像餐厅给服务员一本菜单和下单系统，服务员可以直接下单而不用记住顾客的原话
</div>

</div>
<div>

<div v-click class="bg-white dark:bg-gray-800 border rounded-lg shadow-md overflow-hidden">
  <div class="bg-blue-500 text-white px-4 py-2">
    <div class="font-medium">Function Calling 演示</div>
  </div>
  <div class="p-4 space-y-2 text-sm">
    <div class="font-medium">1. 定义可用函数</div>
    <div class="font-mono bg-gray-50 dark:bg-gray-900 p-2 rounded text-xs leading-normal overflow-auto max-h-50">
```json
{
  "name": "getWeather",
  "description": "获取指定城市的天气信息",
  "parameters": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "城市名称，如北京、上海"
      },
      "date": {
        "type": "string",
        "description": "日期，如2025-03-08"
      }
    },
    "required": ["location"]
  }
}
```
    </div>
    <div class="font-medium mt-2">2. 模型识别并自动调用</div>
    <div class="p-2 bg-green-50 dark:bg-green-900/20 rounded">
      <div class="font-mono text-xs max-h-20 overflow-auto">
```json
function_call: {
  "name": "getWeather",
  "arguments": {
    "location": "北京",
    "date": "2025-03-08"
  }
}
```
      </div>
    </div>
  </div>
</div>

</div>
</div>

---

# Function Calling: 简化的开发流程

<div grid="~ cols-2 gap-8">
<div>

## 实际代码实现

<v-clicks>

<div class="font-mono rounded text-xs leading-normal overflow-auto max-h-100">

```javascript
async function chatWithFunctionCalling(userMessage) {
  // 1. 定义可用的函数
  const functions = [{
    name: 'getWeather',
    description: '获取指定城市的天气信息',
    parameters: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: '城市名称'
        }
      },
      required: ['location']
    }
  }]

  // 2. 发送请求，包含函数定义
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: userMessage }],
    functions,
    function_call: 'auto' // 让AI决定是否调用函数
  })

  // 3. 检查是否调用了函数
  const message = response.choices[0].message

  if (message.function_call) {
    // 4. 获取函数调用详情
    const functionName = message.function_call.name
    const args = JSON.parse(message.function_call.arguments)

    // 5. 执行实际功能
    if (functionName === 'getWeather') {
      const weatherData = await getWeatherData(args.location)
      return `${args.location}的天气：${weatherData.condition}，温度${weatherData.temperature}°C`
    }
  }

  // 如果没有调用函数，返回普通回复
  return message.content
}
```
</div>

</v-clicks>

</div>
<div v-click>

## 功能与优势

<div class="space-y-3 mt-4">
  <div class="flex items-start">
    <div class="bg-green-500 text-white p-1 rounded-full mr-3 mt-1">
      <div class="i-carbon-checkmark text-xs"></div>
    </div>
    <div>
      <span class="font-medium">结构化参数</span> - 模型总是返回有效的JSON，格式与你的规范匹配
    </div>
  </div>

  <div class="flex items-start">
    <div class="bg-green-500 text-white p-1 rounded-full mr-3 mt-1">
      <div class="i-carbon-checkmark text-xs"></div>
    </div>
    <div>
      <span class="font-medium">明确的意图</span> - 清楚模型何时想调用函数，何时只是聊天
    </div>
  </div>

  <div class="flex items-start">
    <div class="bg-green-500 text-white p-1 rounded-full mr-3 mt-1">
      <div class="i-carbon-checkmark text-xs"></div>
    </div>
    <div>
      <span class="font-medium">API支持</span> - 官方API自动处理解析，简化开发流程
    </div>
  </div>

  <div class="flex items-start">
    <div class="bg-green-500 text-white p-1 rounded-full mr-3 mt-1">
      <div class="i-carbon-checkmark text-xs"></div>
    </div>
    <div>
      <span class="font-medium">自然聊天集成</span> - 用户无需特殊语法，模型判断何时调用函数
    </div>
  </div>

  <div class="flex items-start">
    <div class="bg-green-500 text-white p-1 rounded-full mr-3 mt-1">
      <div class="i-carbon-checkmark text-xs"></div>
    </div>
    <div>
      <span class="font-medium">多函数支持</span> - 一次请求可注册多个函数，模型选择最适合的
    </div>
  </div>
</div>

</div>
</div>

---

# 案例：构建智能助手

<div class="flex justify-center mb-6">
  <ToolCallDemo toolName="Function Calling实践" />
</div>

<div v-click class="grid grid-cols-3 gap-6 mt-4">
  <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
    <div class="text-center font-medium mb-2">天气查询</div>
    <div class="text-sm opacity-80">
      定义getWeather函数，当用户询问天气时自动调用，简单直接。
    </div>
  </div>

  <div class="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
    <div class="text-center font-medium mb-2">日程安排</div>
    <div class="text-sm opacity-80">
      定义addCalendarEvent函数，用户说"安排会议"时自动捕获日期、时间、标题参数。
    </div>
  </div>

  <div class="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
    <div class="text-center font-medium mb-2">电商助手</div>
    <div class="text-sm opacity-80">
      定义searchProducts函数，用户询问商品时提取关键词、价格范围等参数。
    </div>
  </div>
</div>

<div v-click class="mt-6 text-center">
  <div class="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/20 rounded-lg text-green-800 dark:text-green-200">
    <div class="flex items-center">
      <div class="i-carbon-face-satisfied text-xl mr-2"></div>
      <div>老板看到演示后很满意</div>
    </div>
  </div>
</div>

---
layout: statement
---

# 又是周一早上... 📊

<div class="text-2xl max-w-3xl mx-auto my-8">
老板兴高采烈地走进你的办公室，一杯咖啡递给你...
</div>

<BossEmployeeChat :messages="[
  { role: 'boss', content: '你的AI工具调用功能实现得太棒了！但我刚从会议上回来...' },
  { role: 'boss', content: '投资人说我们需要更多功能，最好像 App store一样丰富' },
  { role: 'employee', content: '老板，我做不到啊！' },
  { role: 'boss', content: '做完涨薪！', type: 'warning' }
]" />

---
layout: statement
background: https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&q=80
---

# 涨薪？等等... 🤔

<div class="text-xl mt-8" v-click>
  能不能让别人帮我写 Function 呢？我专注开发聊天客户端就行，这样我就不用写那么多 Function 了。
</div>

<div class="text-3xl mt-8" v-click>
  巧了，OpenAI 也这么想
</div>

<div class="mt-8 text-xl max-w-2xl mx-auto opacity-80" v-click>
  Sam Altman 想让全球开发者主动为 ChatGPT 网页开发 Function Calling 工具
</div>

<div class="mt-8 font-bold text-3xl text-red-500" v-click>
  于是 ChatGPT 插件登场了
</div>
