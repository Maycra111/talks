---
layout: section
background: https://images.unsplash.com/photo-1488998527040-85054a85150e?auto=format&q=80
---

# 提示工程：第一代解决方案

<div class="text-xl opacity-80 mt-4">
当你没有特殊API，只能用"说话"让AI做事时...
</div>

---

# 提示工程：巧妙地"骗"AI执行任务

<div grid="~ cols-2 gap-6">
<div>

<v-clicks>

- 🧙‍♂️ **特殊的指令**给模型，引导它生成特定格式
- 🎭 让模型"假装"它能访问外部系统
- 📝 要求模型输出**结构化数据**（如JSON）
- 🎯 用提示词创建**模拟工具调用**的幻觉

</v-clicks>

<div v-click class="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg text-sm">
  <div class="font-mono bg-white dark:bg-gray-900 p-3 rounded text-xs leading-normal overflow-auto max-h-65">
示例：你可以访问天气，当你需要获取天气信息时，请返回JSON格式的模拟结果。我会查询后告诉你结果你再回复用户。
你的回复必须是有效的JSON格式，包含以下字段：

```jsonc
{
  "action": "getWeather",
  "parameters": {
    "city": "地点名称",
    "date": "遵循日期格式(比如2025-03-08)"
  }
}
```
</div>

</div>

</div>
<div class="space-y-4">

<div v-click>
<ToolCallDemo className="max-h-100 overflow-auto" toolName="提示工程模拟" />
</div>

</div>
</div>

---

# 提示工程的问题：不可靠性

<div grid="~ cols-2 gap-8">
<div v-click>

### 🎲 像掷骰子一样不可控

```txt
// 有时候返回完美的JSON
{
  "action": "getWeather",
  "parameters": {
    "city": "北京",
    "date": "2025-03-08"
  }
}

// 有时候却变成这样...
{
  "action": "getWeather"
  "parameters": {
    "city": "北京"
    "date": "2025/03/08"
  }
}
// 缺少逗号和错误的日期格式

// 或者更糟...
抱歉，我无法提供实时天气信息...
```

</div>
<div v-click>

### 🧰 修复的尝试

```javascript
async function askAIWithRetry(userQuestion) {
  // 1. 第一次尝试
  let result = await askAI(userQuestion)
  // 2. 如果失败，再来一次，但提示更强硬
  if (result.error) {
    const strictPrompt = `
    对于 action: getWeather，你必须只返回JSON格式！
    不要有任何额外文字！格式：
    {
      "action": "getWeather",
      "parameters": {
        "city": "地点名称",
        "date": "遵循日期格式(比如2025-03-08)"
      }
    }
   返回此格式！`

    const secondTry = await chatWithAI(strictPrompt)
    try {
      result = JSON.parse(secondTry)
    }
    catch (error) {
      // 3. 还是失败...
      return { error: '多次尝试后仍然失败' }
    }
  }

  return result
}
```

</div>
</div>

<div v-click class="mt-6 text-center">
  <div class="inline-block px-4 py-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-800 dark:text-red-200">
    <carbon-warning-alt class="inline-block mr-2" /> 提示工程虽然有用，但不够稳定，我们需要更可靠的解决方案！
  </div>
</div>

---
layout: center
class: text-center
---

# 问题：我们需要一个更可靠的方法

<div class="flex justify-center mt-10">
  <div class="w-20 h-20 bg-yellow-500 rounded-lg flex items-center justify-center text-white text-4xl transform -rotate-12 shadow-lg">?</div>
</div>

<div v-click class="mt-10 text-3xl font-medium">
  幸运的是...<span class="text-green-500">OpenAI</span>也认识到了这个问题！
</div>

<div v-click class="mt-8 text-xl max-w-2xl mx-auto opacity-80">
  2023年，OpenAI发布了Function Calling功能，彻底改变了游戏规则...
</div>

<div v-click class="mt-10">
  <button class="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition-colors">
    了解官方解决方案 →
  </button>
</div>
