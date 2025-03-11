---
layout: section
background: https://images.unsplash.com/photo-1629752187687-3d3c7ea3a21b?auto=format&q=80
---

# ChatGPT插件：打造生态系统

<div class="text-xl opacity-80 mt-4">
Function Call很强大，但如何让用户自己选择需要的功能？
</div>

---

# ChatGPT插件：把能力扩展到整个互联网

<div grid="~ cols-2 gap-6">
<div>

## 什么是ChatGPT插件?

<v-clicks>

- 🔌 第三方开发者可以创建的**扩展功能**
- 🌐 让ChatGPT访问**外部API和服务**
- 🧩 基于**OpenAPI规范**的标准化接口
- 👥 用户可以自行选择安装的插件
- 📊 从天气查询到网页浏览的全方位功能

</v-clicks>

<div v-click class="mt-6 p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-blue-800 dark:text-blue-200">
<carbon-idea class="inline-block mr-2" /> 就像是给AI一个浏览器，让它能访问各种网站和服务，但这些"网站"专为AI设计
</div>

</div>
<div>

<div v-click class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
  <div class="bg-gray-100 dark:bg-gray-700 px-4 py-2 border-b flex items-center">
    <div class="i-carbon-plug-filled text-blue-500 mr-2"></div>
    <div class="font-medium">ChatGPT插件商店</div>
  </div>
  <div class="p-4">
    <div class="grid grid-cols-2 gap-3">
      <div class="p-2 border rounded-lg flex items-center">
        <div class="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
          <div class="i-carbon-cloud text-blue-500"></div>
        </div>
        <div class="text-sm">天气查询</div>
      </div>
      <div class="p-2 border rounded-lg flex items-center">
        <div class="h-8 w-8 bg-amber-100 rounded-full flex items-center justify-center mr-2">
          <div class="i-carbon-shopping-cart text-amber-500"></div>
        </div>
        <div class="text-sm">网上购物</div>
      </div>
      <div class="p-2 border rounded-lg flex items-center">
        <div class="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
          <div class="i-carbon-search text-green-500"></div>
        </div>
        <div class="text-sm">网页浏览</div>
      </div>
      <div class="p-2 border rounded-lg flex items-center">
        <div class="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center mr-2">
          <div class="i-carbon-restaurant text-purple-500"></div>
        </div>
        <div class="text-sm">餐厅预订</div>
      </div>
    </div>
    <div class="mt-4 text-sm text-center text-gray-500">
      用户可以选择并安装自己需要的插件
    </div>
  </div>
</div>

</div>
</div>

---

# ChatGPT插件的工作原理

<div grid="~ cols-2 gap-8">

<div v-click>

```jsonc
// 1. 创建manifest.json描述文件
{
  "schema_version": "v1",
  "name_for_human": "天气查询",
  "name_for_model": "weather",
  "description_for_human": "获取全球天气预报。",
  "description_for_model": "获取城市天气信息，包括温度、湿度等。",
  "auth": {
    "type": "none"
  },
  "api": {
    "type": "openapi",
    "url": "https://example.com/openapi.yaml"
  },
  "logo_url": "https://example.com/logo.png",
  "contact_email": "support@example.com"
}
```

</div>

<div v-click>

```yaml
# 2. 创建OpenAPI规范描述 (openapi.yaml)
openapi: 3.0.1
info:
  title: 天气查询插件
  description: 一个可以获取全球天气预报的API服务
  version: v1
servers:
  - url: https://weather-api.example.com
paths:
  /weather:
    get:
      operationId: getCurrentWeather
      summary: 获取当前天气预报
      description: 获取指定城市的当前天气条件，包括温度、湿度和天气状况。
      parameters:
        - name: city
          in: query
          description: 城市名称或地区
          required: true
          schema:
            type: string
        - name: date
          in: query
          description: '日期(格式: YYYY-MM-DD)'
          required: false
          schema:
            type: string
      responses:
        '200':
          description: 成功获取天气信息
          content:
            application/json:
              schema:
                type: object
                properties:
                  location:
                    type: string
                    description: 查询的城市名称
                  temperature:
                    type: number
                    description: 当前温度
                  humidity:
                    type: number
                    description: 湿度百分比
                  condition:
                    type: string
                    description: 天气状况描述
                  wind:
                    type: object
                    properties:
                      speed:
                        type: number
                        description: 风速
                      direction:
                        type: string
                        description: 风向
                  forecast:
                    type: array
                    description: 未来24小时预报
                    items:
                      type: object
                      properties:
                        time:
                          type: string
                          format: date-time
                          description: 预报时间
                        temperature:
                          type: number
                          description: 预计温度
                        condition:
                          type: string
                          description: 预计天气状况
        '400':
          description: 无效的请求参数
        '404':
          description: 找不到请求的城市或地区
        '500':
          description: 服务器内部错误
```

</div>
</div>

---

# 用户视角：使用插件

<div grid="~ cols-1 gap-8">
<div>

<div class="space-y-6 mt-4">
  <div class="flex">
    <div class="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
      <div class="i-carbon-user"></div>
    </div>
    <div class="ml-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
      帮我查询一下北京明天的天气
    </div>
  </div>

  <div class="flex">
    <div class="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white">
      <div class="i-carbon-bot"></div>
    </div>
    <div class="ml-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg max-w-sm">
      <div class="text-xs text-gray-500 mb-1">使用天气查询插件...</div>
      根据天气插件的数据，北京明天预计多云，气温22°C至28°C，湿度60%，东南风3级。适合户外活动，但建议带伞，因为下午可能有短时阵雨。
    </div>
  </div>

  <div class="text-center text-sm opacity-75">
    ChatGPT自动选择合适的插件，无需用户指定具体操作
  </div>
</div>

</div>
</div>

---

# 插件vs函数调用：看似相同，实则不同

<div class="flex justify-center mb-6">
  <img src="https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&q=80" class="h-40 rounded-lg shadow-lg" />
</div>

<div grid="~ cols-2 gap-8">
<div v-click>

## Function Calling
<div class="space-y-2 mt-4">
  <div class="flex items-start">
    <div class="bg-blue-100 p-1 rounded-full mr-2 mt-1">
      <div class="i-carbon-function text-blue-500 text-xs"></div>
    </div>
    <div>
      <span class="font-medium">开发者定义</span> - 由开发应用的程序员自己创建
    </div>
  </div>

  <div class="flex items-start">
    <div class="bg-blue-100 p-1 rounded-full mr-2 mt-1">
      <div class="i-carbon-function text-blue-500 text-xs"></div>
    </div>
    <div>
      <span class="font-medium">本地集成</span> - 在应用代码中直接调用内部函数
    </div>
  </div>

  <div class="flex items-start">
    <div class="bg-blue-100 p-1 rounded-full mr-2 mt-1">
      <div class="i-carbon-function text-blue-500 text-xs"></div>
    </div>
    <div>
      <span class="font-medium">API结构</span> - 通过函数参数对象直接定义
    </div>
  </div>

  <div class="flex items-start">
    <div class="bg-blue-100 p-1 rounded-full mr-2 mt-1">
      <div class="i-carbon-function text-blue-500 text-xs"></div>
    </div>
    <div>
      <span class="font-medium">使用场景</span> - 为特定应用扩展能力
    </div>
  </div>
</div>

</div>
<div v-click>

## ChatGPT插件
<div class="space-y-2 mt-4">
  <div class="flex items-start">
    <div class="bg-purple-100 p-1 rounded-full mr-2 mt-1">
      <div class="i-carbon-plug text-purple-500 text-xs"></div>
    </div>
    <div>
      <span class="font-medium">第三方提供</span> - 由外部开发者/公司创建的服务
    </div>
  </div>

  <div class="flex items-start">
    <div class="bg-purple-100 p-1 rounded-full mr-2 mt-1">
      <div class="i-carbon-plug text-purple-500 text-xs"></div>
    </div>
    <div>
      <span class="font-medium">HTTP API</span> - 通过互联网调用外部服务
    </div>
  </div>

  <div class="flex items-start">
    <div class="bg-purple-100 p-1 rounded-full mr-2 mt-1">
      <div class="i-carbon-plug text-purple-500 text-xs"></div>
    </div>
    <div>
      <span class="font-medium">OpenAPI规范</span> - 使用标准化的API描述格式
    </div>
  </div>

  <div class="flex items-start">
    <div class="bg-purple-100 p-1 rounded-full mr-2 mt-1">
      <div class="i-carbon-plug text-purple-500 text-xs"></div>
    </div>
    <div>
      <span class="font-medium">使用场景</span> - 平台化生态系统，用户可选择安装
    </div>
  </div>
</div>

</div>
</div>

<div v-click class="mt-6 text-center">
  <div class="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-800 dark:text-blue-200">
    <carbon-idea class="inline-block mr-2" /> 两者结合使用效果最佳：插件用于公共第三方服务，函数调用用于应用内功能
  </div>
</div>

---

# ChatGPT插件的局限性

<div grid="~ cols-2 gap-8">
<div v-click>

## 主要限制

<div class="space-y-3 mt-4">
  <div class="flex items-start">
    <div class="bg-red-100 p-1 rounded-full mr-3 mt-1">
      <div class="i-carbon-close text-red-500 text-xs"></div>
    </div>
    <div>
      <span class="font-medium">平台捆绑</span> - 只能在官方ChatGPT平台使用
    </div>
  </div>

  <div class="flex items-start">
    <div class="bg-red-100 p-1 rounded-full mr-3 mt-1">
      <div class="i-carbon-close text-red-500 text-xs"></div>
    </div>
    <div>
      <span class="font-medium">审核限制</span> - 需要OpenAI审核和批准
    </div>
  </div>

  <div class="flex items-start">
    <div class="bg-red-100 p-1 rounded-full mr-3 mt-1">
      <div class="i-carbon-close text-red-500 text-xs"></div>
    </div>
    <div>
      <span class="font-medium">集成复杂</span> - 需要开发和维护API服务
    </div>
  </div>

  <div class="flex items-start">
    <div class="bg-red-100 p-1 rounded-full mr-3 mt-1">
      <div class="i-carbon-close text-red-500 text-xs"></div>
    </div>
    <div>
      <span class="font-medium">功能裁剪</span> - 只能通过HTTP API提供功能
    </div>
  </div>
</div>

</div>
<div v-click>

## 开发者困境

<div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mt-4">
  <div class="flex mb-4">
    <div class="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
      <div class="i-carbon-face-dizzy text-xl"></div>
    </div>
    <div class="ml-3">
      <div class="font-medium">插件开发者小明的困惑</div>
      <div class="text-sm opacity-75">开发了一个强大的AI辅助工具</div>
    </div>
  </div>

  <div class="space-y-3 text-sm">
    <div class="bg-white dark:bg-gray-900 p-2 rounded">
      "我为ChatGPT开发了一个插件，审核等了3个月..."
    </div>
    <div class="bg-white dark:bg-gray-900 p-2 rounded">
      "我的插件还想给Claude、Gemini等其他AI使用，难道要重复开发？"
    </div>
    <div class="bg-white dark:bg-gray-900 p-2 rounded">
      "有用户想在私有部署中使用我的工具，但插件只能在网页版ChatGPT用..."
    </div>
  </div>

  <div class="flex my-4 items-center">
    <div class="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
      <div class="i-carbon-face-dizzy text-xl"></div>
    </div>
    <div class="ml-3">
      <div class="font-medium">其他聊天应用开发者的吐槽</div>
    </div>
  </div>
  <div class="space-y-3 text-sm">
    <div class="bg-white dark:bg-gray-900 p-2 rounded">
      这个插件功能跟我有啥关系，我的聊天应用又不能用
    </div>
  </div>
</div>

</div>
</div>

<div v-click class="mt-6 text-center">
  <div class="inline-block px-5 py-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-800 dark:text-amber-200">
    <div class="flex items-center">
      <div class="i-carbon-warning-alt text-xl mr-2"></div>
      <div>老板一脸严肃："我们需要更通用的方案，能在所有AI应用上运行。找到解决方案！"</div>
    </div>
  </div>
</div>

---
layout: statement
---

# 梦想照进现实... ✨

<div v-click class="text-3xl mt-10">
  如果有一个<span class="text-blue-500 font-bold">标准协议</span>，让所有AI应用使用相同方式访问工具？
</div>

<div v-click class="text-xl mt-10 max-w-2xl mx-auto opacity-80">
  开发一次工具，能被所有支持该协议的AI应用使用，无论是ChatGPT、Claude还是你自己开发的应用...
</div>

<div v-click class="mt-10 flex items-center justify-center">
  <div class="text-5xl transform -rotate-12 font-bold text-green-500">MCP!</div>
  <div class="ml-3 text-xl">模型上下文协议</div>
</div>
