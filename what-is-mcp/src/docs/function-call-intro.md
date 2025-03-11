## 一、回顾：ChatGPT 最早期用法

在最初的 ChatGPT API（`v1/chat/completions`）里，最常见的用法就是让模型直接输出文本回答。下面是一个最简单的 `curl` 调用示例：

```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_OPENAI_API_KEY" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [
      { "role": "user", "content": "给我讲一个笑话" }
    ]
  }'
```

> - `messages`: 对话数组，里面每个对象代表一次对话，`role` 通常有 `user`, `assistant`, `system` 等。
> - `content`: 就是聊天的文本。
> - **返回**：一段由 ChatGPT 生成的文字。

在这个阶段，如果我们想让模型“做些什么”，比如根据用户的文字生成一个任务指令，其实只能自己从文本里“找”想要的信息，然后调用自己的后端业务逻辑。

---

## 二、“正则匹配 JSON”示例

为了让 ChatGPT 输出的内容更“可机读”，很多人会让 ChatGPT 返回 JSON 格式，然后在自己代码里用正则 / JSON parse 来解析它。例如要让 ChatGPT 生成一个任务指令，指令包含 `action` 和 `params` 字段，就可以这样提示 ChatGPT：

**1. 构造 Prompt**
我们对 ChatGPT 的对话进行引导——请求它以 JSON 格式输出：

```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_OPENAI_API_KEY" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [
      {
        "role": "user",
        "content": "请以 JSON 格式输出一条指令，字段包含 action（说明要执行的动作）和 params（对应的参数），例如：{\"action\": \"sendEmail\",\"params\": {\"to\":\"someone@example.com\",\"subject\":\"Hello\"}}"
      }
    ]
  }'
```

**2. ChatGPT 返回示例**
理论上它会返回类似这样的一段文本：

```
{
  "action": "sendEmail",
  "params": {
    "to": "someone@example.com",
    "subject": "Hello"
  }
}
```

**3. 解析 JSON**
一旦拿到这个文本，你可以在后端或前端写代码来处理。例如 Node.js 下，用 `fetch`（或 axios）请求后得到 response 的 `data`，再用 `JSON.parse()` 来转成对象，提取其中的 `action` 和 `params`。如果 API 返回的文本里有其他多余文字，你可能需要先用正则把“JSON 部分”截取出来后再解析。

```js
// Node.js 示例 (伪代码)
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENAI_API_KEY}`
  },
  body: JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: [{
      role: 'user',
      content: '请输出包含 action 和 params 的 JSON'
    }]
  })
})
const jsonResult = await response.json()

// jsonResult.choices[0].message.content 可能包含 ChatGPT 返回的那段 JSON 字符串
const chatOutput = jsonResult.choices[0].message.content

// 假设 chatOutput = "{ \"action\": \"sendEmail\", \"params\": {...}}"
let result
try {
  // 有时要用正则确保只提取 { ... } 部分
  // const matched = chatOutput.match(/\{[\s\S]*\}/);
  // result = JSON.parse(matched[0]);
  result = JSON.parse(chatOutput)
}
catch (error) {
  // 处理解析错误
  console.error(error)
}

// 拿到 action 和 params
const { action, params } = result
// 然后调用自己后端的 sendEmail(params) 等函数
```

**4. 问题**

- ChatGPT 返回的 JSON 可能会有多余字符，或者因为对话上下文变动导致格式偶尔变形，解析容易出错。
- 这种方式对初学者来说虽易理解，但非常脆弱，不能保证 100% 一致性。

---

## 三、Function Call：官方的结构化调用方案

为了解决“自行解析 JSON”的不稳定问题，OpenAI 提供了 **Function Call** 能力。我们可以在请求中 **显式** 定义一些可调用的函数，指定它们的参数类型（通过 JSON Schema），然后让 ChatGPT 决定是否要调用，以及如何传入参数。这样就不需要在对话中再去“自己强调 JSON 格式”，也不用写正则做额外解析了。

### 1. 示例函数定义

假设我们想注册一个名为 `getWeather` 的函数，它需要用户传入城市名称，返回城市天气。我们可以这样写：

```json
[
  {
    "name": "getWeather",
    "description": "获取某个城市的天气信息",
    "parameters": {
      "type": "object",
      "properties": {
        "city": {
          "type": "string",
          "description": "城市名，例如 Beijing"
        }
      },
      "required": ["city"]
    }
  }
]
```

### 2. 发起 ChatGPT 请求（`curl` 示例）

我们在请求体里带上这个函数定义，并允许 ChatGPT 在对话中调用它：

```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_OPENAI_API_KEY" \
  -d '{
    "model": "gpt-3.5-turbo-0613",
    "messages": [
      { "role": "user", "content": "今天天气怎么样？我在北京" }
    ],
    "functions": [
      {
        "name": "getWeather",
        "description": "获取某个城市的天气信息",
        "parameters": {
          "type": "object",
          "properties": {
            "city": {
              "type": "string",
              "description": "城市名，例如 Beijing"
            }
          },
          "required": ["city"]
        }
      }
    ],
    "function_call": "auto"
  }'
```

### 3. ChatGPT 返回（Function Call 指令）

如果 ChatGPT 判断需要调用 `getWeather`，它会返回一个类似下面的结构（注意 `role` 会变为 `"assistant"`，但 `content` 会是空，真正的指令在 `function_call` 字段里）：

```json
{
  "id": "...",
  "object": "chat.completion",
  "created": 1234567890,
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": null,
        "function_call": {
          "name": "getWeather",
          "arguments": "{ \"city\": \"北京\" }"
        }
      },
      "finish_reason": "stop",
      "index": 0
    }
  ],
  "usage": { }
}
```

这样一来，我们 **不再需要** 去分析 ChatGPT 自由输出的文本，只要检查一下 `function_call` 是否存在即可。如果存在，就去调用后端的 `getWeather("北京")` 方法，把结果再给到 ChatGPT 或直接返回给用户。

### 4. Node.js 示范

```js
const fetch = require('node-fetch') // 或者使用 axios

async function chatWithFunctionCall(userMessage) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo-0613',
      messages: [{ role: 'user', content: userMessage }],
      functions: [
        {
          name: 'getWeather',
          description: '获取某个城市的天气信息',
          parameters: {
            type: 'object',
            properties: {
              city: {
                type: 'string',
                description: '城市名，例如 Beijing'
              }
            },
            required: ['city']
          }
        }
      ],
      function_call: 'auto'
    })
  })

  const data = await response.json()

  // 假设只有一个 choice
  const choice = data.choices[0]
  if (choice.message.function_call) {
    const { name, arguments: args } = choice.message.function_call
    if (name === 'getWeather') {
      // 解析参数
      const parsedArgs = JSON.parse(args)
      const city = parsedArgs.city

      // 调用你自己后端实际的 getWeather 函数
      const weatherResult = await getWeather(city)

      // 把结果再发送给 ChatGPT 继续生成回复（可选）
      const secondResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo-0613',
          messages: [
            { role: 'user', content: userMessage },
            { role: 'assistant', content: null, function_call: { name, arguments: args } },
            // 这里把函数调用的结果以 function role 形式传给模型
            { role: 'function', name: 'getWeather', content: JSON.stringify(weatherResult) }
          ]
        })
      })

      const secondData = await secondResponse.json()
      return secondData.choices[0].message.content // 返回 ChatGPT 的最终回答
    }
  }

  // 如果没有 function_call，就直接返回模型文字回答
  return choice.message.content
}
```

> 这样，Function Call 让“模型决定何时需要调用后端函数”，并返回一个标准化的 JSON 字段 `function_call`，极大简化了前后端对接的逻辑和解析成本。

---

## 四、ChatGPT Plugin：让 Function Call 走向插件化

当我们有了 Function Call 的机制之后，OpenAI 又推出 **ChatGPT Plugin** 体系——本质就是把你的后端 API 通过一份 **插件配置**（通常是 `.well-known/ai-plugin.json`）声明给 ChatGPT，让 ChatGPT 在对话中自动知道如何调用你的服务。

### 1. 一个最简单的插件说明文件示例

```jsonc
{
  "schema_version": "v1",
  "name_for_human": "Weather Plugin",
  "name_for_model": "weather_plugin",
  "description_for_human": "查询天气的插件",
  "description_for_model": "提供查询城市天气的API",
  "auth": {
    "type": "none"
  },
  "api": {
    "type": "openapi",
    "url": "https://你的域名.com/openapi.json",
    "is_user_authenticated": false
  },
  "logo_url": "https://你的域名.com/logo.png",
  "contact_email": "support@你的域名.com",
  "legal_info_url": "https://你的域名.com/legal"
}
```

### 2. OpenAPI 规范

`"api"` 字段声明了 ChatGPT 插件要用到的所有接口，你需要在 `openapi.json` 中对这些接口进行描述。比如我们的 `GET /weather` 接口：

```jsonc
{
  "openapi": "3.0.1",
  "info": {
    "title": "Weather API",
    "version": "1.0.0"
  },
  "paths": {
    "/weather": {
      "get": {
        "operationId": "getWeather",
        "summary": "获取天气",
        "parameters": [
          {
            "name": "city",
            "in": "query",
            "description": "城市名称",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "查询成功",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/WeatherResponse"
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "WeatherResponse": {
        "type": "object",
        "properties": {
          "temperature": {
            "type": "number"
          },
          "description": {
            "type": "string"
          }
        }
      }
    }
  }
}
```

### 3. 部署 & 使用

- 你把上述 `openapi.json` 和 `ai-plugin.json` 部署在自己后端指定位置，比如：
  - `GET https://yourdomain.com/.well-known/ai-plugin.json`
  - `GET https://yourdomain.com/openapi.json`
- 在 ChatGPT 插件商店或接口里注册你的插件地址，让 ChatGPT 知道如何访问你的 API 说明文件。
- 当用户在 ChatGPT 中启用你的插件，并提出需求时，ChatGPT 会自动调用你在 OpenAPI 中声明的对应接口。这其实与 Function Call 的思路一致，只不过将所有接口声明整合到一个 “插件” 规范里。

这样，你就可以把自己的后端 API 作为一个“ChatGPT Plugin”开放给更多人使用，而 ChatGPT 可以根据对话内容“自主”决定要不要调用你的插件接口、如何构造请求、如何返回结果。

---

## 五、总结

1. **原始阶段**：直接返回文字，需要用户自行解析意图。
2. **正则匹配 JSON**：通过在 Prompt 中让 ChatGPT 输出 JSON，自己做解析，这是一种过渡性方案。
3. **Function Call**：官方支持的更可靠方式，让模型输出标准化的函数调用 JSON。前后端得以简化逻辑，减少解析失败。
4. **ChatGPT Plugin**：将 Function Call 进一步拓展成插件生态，把你后端的 API 以 OpenAPI 等形式向 ChatGPT 注册，方便更多人“即插即用”。

对于 **从来没接触过 LLM API 的程序员**，只要理解：

- **LLM（大语言模型）** 擅长处理自然语言和生成文本，但并不“直接执行”你的后端代码。
- **Function Call / Plugin** 本质是给 LLM 一份“可调用函数或接口”的说明，让它能以 JSON 形式“请求调用”你的服务，而不是随意生成文本。
- **你只需** 在拿到模型返回的“调用指令”后，去真正调用后端函数或请求。执行结果（如果需要）再返回给 LLM 或给用户即可。

掌握以上概念，就能顺利构建出“聊天 + 业务逻辑”的智能应用，或者将你的后端功能变成一个 ChatGPT Plugin 供他人使用。祝你开发顺利!
