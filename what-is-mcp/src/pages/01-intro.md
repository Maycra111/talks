---
layout: intro
---

# 你好，开发者朋友们! 👋

<div class="text-xl opacity-80 mb-8">想象一下，你刚刚接到一个激动人心的任务：开发一款超智能聊天应用！</div>

<div class="mt-8 grid grid-cols-2 gap-6">
<div>

## 我们的奇幻之旅
<v-clicks>

- 🛠️ 从最基础的AI聊天API开始
- 🪄 用提示词魔法实现工具调用
- 🌟 探索Function Call官方解决方案
- 🔌 了解ChatGPT插件的世界
- 🦸‍♂️ 发现MCP如何一统江湖

</v-clicks>

</div>
<div class="flex flex-col justify-center items-center">
<img src="https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?auto=format&q=80" class="h-40 rounded-lg shadow-xl" />
<div class="mt-4 text-sm opacity-60">准备好了吗？系好安全带！</div>
</div>
</div>

<div class="abs-br mx-14 my-12 flex">
  <div class="ml-3 flex flex-col text-right">
    <div class="text-sm opacity-50">2025 葬爱非主流小明</div>
  </div>
</div>

---
layout: statement
---

# 想象一下... 🤔

<div class="text-2xl max-w-3xl mx-auto my-8">
你是一家科技公司的全栈开发者，老板突然对你说...
</div>

<div v-click class="text-3xl font-bold text-blue-500">
  "最近AI聊天很火，你来写一个AI聊天应用，下周上线！"
</div>

<div v-click class="my-10 text-xl">
  但你从未写过一行AI相关代码... 😱
</div>

<div v-click class="text-center mt-10 text-xl">
  <div class="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/20 rounded-lg text-green-800 dark:text-green-200">
    <carbon-idea class="inline-block mr-2" /> 别担心！从最简单的部分开始，我们一步步来！
  </div>
</div>

---

# 从最简单的开始：聊天API

<div grid="~ cols-2 gap-6">
<div>

## 就像点餐一样简单

<v-clicks>

- 你发送消息（你的订单）
- AI模型处理内容（厨师烹饪）
- 返回文本回复（美食送达）
- 展示给用户（享用美餐）

</v-clicks>

<div v-click class="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
<carbon-idea class="text-blue-500 inline-block mr-2" /> 最简单的AI集成：
<ul class="ml-6 mt-2 list-disc">
  <li>RESTful API调用</li>
  <li>简单的请求-响应模式</li>
  <li>几乎所有编程语言都支持</li>
</ul>
</div>

</div>
<div>

<ApiDemo apiName="OpenAI Chat API" :autoPlay="false" />

</div>
</div>

---

# 基础聊天API代码很简单

<CodeComparison title="基础聊天实现">
  <template #left>

```javascript
// 传统API调用方式 - 伪代码
async function chatWithAI(userMessage) {
  // 1. 准备请求
  const response = await fetch(
    'https://api.openai.com/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'user', content: userMessage }
        ]
      })
    }
  )

  // 2. 解析响应
  const data = await response.json()

  // 3. 从响应中提取AI回复
  return data.choices[0].message.content
}
```

  </template>
  <template #right>

```javascript
// 简化版本 - 使用SDK
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

async function chatWithAI(userMessage) {
  // 一行代码发送请求
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'user', content: userMessage }
    ]
  })

  // 直接获取回复
  return completion.choices[0].message.content
}

// 就这么简单！🎉
```

  </template>
</CodeComparison>

<div v-click class="mt-4 text-center">
  <div class="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/20 rounded-lg text-green-800 dark:text-green-200">
    恭喜！这就是接入AI的最基础方法，你已经成功迈出第一步！🎉
  </div>
</div>

---

# 等等，用户想要连续对话...🤔

<div grid="~ cols-2 gap-8">
<div v-click>

## 问题：AI的"记忆丧失"

```
用户: 我最喜欢的颜色是蓝色

AI: 蓝色是个很棒的选择！天空和海洋的颜色...

用户: 为什么你觉得我喜欢它?

AI: 抱歉，我不知道您喜欢什么颜色。
    您能告诉我您喜欢什么颜色吗？
```

<div class="mt-4 p-3 bg-amber-100 dark:bg-amber-900/20 rounded-lg text-amber-800 dark:text-amber-200">
<carbon-warning class="inline-block mr-2" /> 如果每次只发送当前消息，AI无法记住对话历史！
</div>

</div>
<div v-click>

## 解决方案：发送完整对话历史

```javascript
// 在应用中维护对话历史
let conversationHistory = [];

async function chat(userMessage) {
  // 添加用户消息到历史
  conversationHistory.push({
    role: 'user',
    content: userMessage
  });
  
  // 发送整个对话历史
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: conversationHistory
  });
  
  // 添加AI回复到历史
  const aiMessage = response.choices[0].message;
  conversationHistory.push(aiMessage);
  
  return aiMessage.content;
}
```

</div>
</div>

---

# 理解消息类型：构建有效对话

<div grid="~ cols-3 gap-6">
<div v-click>

## 1️⃣ System消息

<div class="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
  <div class="font-medium text-blue-600 dark:text-blue-300 mb-2">role: "system"</div>
  <div class="text-sm">
    <ul class="ml-4 list-disc">
      <li>设定AI的行为和角色</li>
      <li>定义回答的风格、限制</li>
      <li>用户通常看不到此消息</li>
      <li>AI会始终遵循这些指令</li>
    </ul>
    <div class="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">
      你是一名专业的客服助手，回答要简洁，态度友好，不要透露用户个人信息。
    </div>
  </div>
</div>

</div>
<div v-click>

## 2️⃣ User消息

<div class="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
  <div class="font-medium text-green-600 dark:text-green-300 mb-2">role: "user"</div>
  <div class="text-sm">
    <ul class="ml-4 list-disc">
      <li>用户发送的问题或指令</li>
      <li>对话的驱动力</li>
      <li>可包含问题、请求、陈述</li>
      <li>通常显示在UI上</li>
    </ul>
    <div class="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">
      我想找一个预算2000元以内的手机，拍照性能要好。
    </div>
  </div>
</div>

</div>
<div v-click>

## 3️⃣ Assistant消息

<div class="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
  <div class="font-medium text-purple-600 dark:text-purple-300 mb-2">role: "assistant"</div>
  <div class="text-sm">
    <ul class="ml-4 list-disc">
      <li>AI的回复内容</li>
      <li>根据历史上下文生成</li>
      <li>反映system指令的限制</li>
      <li>展示给用户的内容</li>
    </ul>
    <div class="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">
      在2000元预算内，推荐您考虑红米Note 12 Pro或realme GT Neo...
    </div>
  </div>
</div>

</div>
</div>

<div v-click class="mt-4 text-center">
  <div class="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-blue-800 dark:text-blue-200 text-sm">
    <carbon-idea class="inline-block mr-2" /> 组合这三种消息，可以构建有记忆、有个性、有限制的AI对话体验！
  </div>
</div>

---

# 对话历史的处理：后端与前端差异

<div grid="~ cols-2 gap-8">
<div v-click>

## 后端发送完整历史

```javascript
// 真实发送到API的消息
[
  {
    role: "system",
    content: "你是一个乐于助人的AI助手，回答要简洁。"
  },
  {
    role: "user",
    content: "我想去巴黎旅游"
  },
  {
    role: "assistant", 
    content: "巴黎是个很棒的选择！您想了解哪方面信息？"
  },
  {
    role: "user",
    content: "最著名的景点是什么" 
  }
  // 当前用户消息
]
```

<div class="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm">
  <carbon-checkmark-outline class="text-green-500 inline-block mr-1" /> API总是接收完整对话历史，确保连贯的上下文
</div>

</div>
<div v-click>

## 前端UI选择性显示

<div class="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm h-64 overflow-auto">
  <div class="flex mb-3">
    <div class="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
      <div class="i-carbon-user"></div>
    </div>
    <div class="ml-3 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg max-w-[80%]">
      我想去巴黎旅游
    </div>
  </div>
  
  <div class="flex mb-3">
    <div class="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white">
      <div class="i-carbon-bot"></div>
    </div>
    <div class="ml-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg max-w-[80%]">
      巴黎是个很棒的选择！您想了解哪方面信息？
    </div>
  </div>
  
  <div class="flex mb-3">
    <div class="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
      <div class="i-carbon-user"></div>
    </div>
    <div class="ml-3 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg max-w-[80%]">
      最著名的景点是什么
    </div>
  </div>
  
  <div class="flex justify-center">
    <div class="text-xs p-1 px-2 bg-gray-200 dark:bg-gray-700 rounded">
      <div class="i-carbon-information text-blue-500 inline-block mr-1"></div>
      System Prompt在UI中隐藏
    </div>
  </div>
</div>

<div class="mt-3 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-sm">
  <carbon-idea class="text-purple-500 inline-block mr-1" /> 界面通常隐藏System消息，只显示用户和AI对话
</div>

</div>
</div>

<div v-click class="mt-6 text-center">
  <div class="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-800 dark:text-blue-200">
    <carbon-idea class="inline-block mr-2" /> 开发提示：始终在后端保存完整历史，前端可根据需要灵活显示！
  </div>
</div>

---

# 你的聊天应用上线了! 🎉

<div grid="~ cols-2 gap-8">
<div v-click>

## 最初，用户很开心...
<img src="https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&q=80" class="h-40 rounded-lg shadow-lg mx-auto mb-4" />

<div class="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
  <div class="font-bold mb-1">用户问:</div>
  <div>2+3等于多少?</div>
  <div class="font-bold mt-2 mb-1 text-green-600">AI回答:</div>
  <div>2+3等于5。</div>
</div>

</div>
<div v-click>

## 但很快，他们想要更多...
<img src="https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&q=80" class="h-40 rounded-lg shadow-lg mx-auto mb-4" />

<div class="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
  <div class="font-bold mb-1">用户问:</div>
  <div>帮我查询北京今天的天气</div>
  <div class="font-bold mt-2 mb-1 text-red-500">AI回答:</div>
  <div>抱歉，我无法获取实时的天气信息。我只能处理我训练数据中包含的信息。</div>
</div>

</div>
</div>

<div v-click class="mt-8 text-center">
  <div class="inline-block px-5 py-3 bg-amber-100 dark:bg-amber-900/20 rounded-lg text-amber-800 dark:text-amber-200 text-lg">
    <carbon-warning class="inline-block mr-2" /> 核心问题：如何让AI帮用户完成<span class="font-bold">实际任务</span>，而不只是聊天？
  </div>
</div>

---
layout: center
class: text-center
---

# 难题出现了 🧩

<div class="max-w-lg mx-auto mt-8">
  <img src="https://images.unsplash.com/photo-1588591795084-1770cb3be374?auto=format&q=80" class="h-60 mx-auto rounded-lg shadow-xl" />
</div>

<div v-click class="mt-8 text-2xl">
  你需要让AI能够<span class="text-green-500 font-bold">执行操作</span>，而不只是聊天
</div>

<div v-click class="mt-6 text-xl opacity-80">
  就像给餐厅服务员一把能打开厨房门的钥匙 🔑
</div>

<div v-click class="mt-10">
  <button class="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition-colors">
    探索第一代解决方案 →
  </button>
</div>
