# MCP 模型上下文协议概述

**Model Context Protocol（MCP）** 是由 Anthropic 提出的一个开放协议，用于标准化应用向大型语言模型（LLM）提供上下文信息的方式 ([Introduction - Model Context Protocol](https://modelcontextprotocol.io/introduction#:~:text=MCP%20is%20an%20open%20protocol,different%20data%20sources%20and%20tools))。简单来说，可以把 MCP 比作 AI 应用的 “USB-C 接口” ([Introduction - Model Context Protocol](https://modelcontextprotocol.io/introduction#:~:text=MCP%20is%20an%20open%20protocol,different%20data%20sources%20and%20tools))——就像 USB-C 为设备连接各种外设提供了统一标准，MCP 为将 AI 模型连接到不同数据源和工具提供了统一标准。

**为什么需要 MCP？** 随着 LLM 应用越来越复杂，我们常常希望它们能访问外部知识库、调用工具执行操作等。然而每种模型或应用各自为政，缺乏统一接口。MCP 的出现正是为了解决这一问题 ([Introduction - Model Context Protocol](https://modelcontextprotocol.io/introduction#:~:text=MCP%20helps%20you%20build%20agents,and%20tools%2C%20and%20MCP%20provides))：

- 提供**丰富的现成集成**：MCP 已经支持一系列预构建的集成，LLM 应用可以直接对接 ([Introduction - Model Context Protocol](https://modelcontextprotocol.io/introduction#:~:text=MCP%20helps%20you%20build%20agents,and%20tools%2C%20and%20MCP%20provides))（例如文件系统、数据库、网络服务等，后文将详述）。
- **模型/供应商无关的灵活性**：通过 MCP，可以较为容易地在不同的 LLM 提供商或平台之间切换 ([Introduction - Model Context Protocol](https://modelcontextprotocol.io/introduction#:~:text=,your%20data%20within%20your%20infrastructure))。开发者无需为每个模型定制不同接口。
- **安全和隐私最佳实践**：MCP 提供在您自有基础设施中保护数据的最佳实践 ([Introduction - Model Context Protocol](https://modelcontextprotocol.io/introduction#:~:text=,your%20data%20within%20your%20infrastructure))，确保模型访问外部数据时的安全控制（例如用户授权机制、访问范围限定等）。

## 工作原理与架构

MCP 采用**客户端-服务器**架构，其核心思想是让**宿主应用（Host）**通过 MCP 客户端与一个或多个**MCP 服务器（Server）**通信 ([Introduction - Model Context Protocol](https://modelcontextprotocol.io/introduction#:~:text=At%20its%20core%2C%20MCP%20follows,can%20connect%20to%20multiple%20servers))。整体架构包含以下角色 ([Introduction - Model Context Protocol](https://modelcontextprotocol.io/introduction#:~:text=At%20its%20core%2C%20MCP%20follows,can%20connect%20to%20multiple%20servers))：

- **MCP 宿主（Host）**：运行 LLM 的应用程序（例如 Claude Desktop、IDE 插件或其他 AI 工具），希望通过 MCP 访问外部数据或功能 ([Introduction - Model Context Protocol](https://modelcontextprotocol.io/introduction#:~:text=At%20its%20core%2C%20MCP%20follows,can%20connect%20to%20multiple%20servers))。宿主相当于用户接口，与用户交互并驱动 LLM 对话。
- **MCP 客户端（Client）**：宿主应用内部的协议客户端，负责与 MCP 服务器建立一对一连接 ([Introduction - Model Context Protocol](https://modelcontextprotocol.io/introduction#:~:text=At%20its%20core%2C%20MCP%20follows,can%20connect%20to%20multiple%20servers))。客户端处理协议细节（发送请求、接收响应），向宿主提供统一的接口。
- **MCP 服务器（Server）**：独立的轻量级程序，通过 MCP 协议向客户端**暴露特定能力** ([Introduction - Model Context Protocol](https://modelcontextprotocol.io/introduction#:~:text=access%20data%20through%20MCP%20,the%20standardized%20Model%20Context%20Protocol))。每个服务器专注提供一种数据源或工具集成，例如文件读写、数据库查询、API 调用等。
- **本地/远程数据源**：MCP 服务器可安全访问的实际数据或服务。 ([Introduction - Model Context Protocol](https://modelcontextprotocol.io/introduction#:~:text=,MCP%20servers%20can%20connect%20to))例如：
  - _本地数据源_：宿主所在机器的文件、数据库、应用等，由本地 MCP 服务器调用访问 ([Introduction - Model Context Protocol](https://modelcontextprotocol.io/introduction#:~:text=,MCP%20servers%20can%20securely%20access))。
  - _远程服务_：通过 API 等方式可访问的外部系统，由对应的 MCP 服务器连接 ([Introduction - Model Context Protocol](https://modelcontextprotocol.io/introduction#:~:text=,MCP%20servers%20can%20connect%20to))。

在实际运行中，宿主应用会启动或连接所需的 MCP 服务器。宿主通过 MCP 客户端发送标准化请求，与各服务器进行通信。MCP 使用 JSON-RPC 2.0 作为底层消息格式 ([Transports - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/transports#:~:text=MCP%20uses%20JSON,back%20into%20MCP%20protocol%20messages))——所有请求、响应和通知都封装为 JSON-RPC 消息，由传输层发送。典型的交互流程如下：

1. **初始化握手**：客户端连接服务器后，先发送 `initialize` 请求，告知协议版本和自身支持的能力；服务器回应自身版本和能力，双方确认支持的功能，然后客户端发送 `initialized` 通知表示就绪 ([Core architecture - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/architecture#:~:text=1))。这一握手确保双方能力匹配，比如服务器声明提供哪些功能（工具、资源等），客户端声明支持哪些类型的交互。
2. **正常消息交换**：握手完成后，客户端和服务器间即可按需通信。双方都可以发送**请求**（需要对方回复）或**通知**（单向消息无需回应） ([Core architecture - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/architecture#:~:text=After%20initialization%2C%20the%20following%20patterns,are%20supported))。所有消息均符合 JSON-RPC 格式，包含方法名和参数等 ([Transports - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/transports#:~:text=MCP%20uses%20JSON,back%20into%20MCP%20protocol%20messages))。例如客户端可以请求服务器执行某个工具操作，服务器也可以发送通知告知有新资源可用等。
3. **终止连接**：任一方可以随时终止，如显式关闭、传输断开或错误导致 ([Core architecture - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/architecture#:~:text=3))。MCP 定义了一套标准错误码和错误处理流程，确保异常情况下双方安全断连 ([Core architecture - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/architecture#:~:text=Error%20handling))。

由于 MCP 是独立于具体传输层的协议，它支持多种通信方式。例如，对于本地部署，**标准输入输出（STDIO）传输**可用于客户端和服务器在同一台机器上通过管道通信 ([Transports - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/transports#:~:text=Standard%20Input%2FOutput%20))。对于网络场景，MCP 提供**HTTP + SSE（Server-Sent Events）传输**，通过 HTTP POST 发送请求、SSE 推送实时消息 ([Transports - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/transports#:~:text=Server))。开发者也可以根据需要定制其他传输层实现，只需满足协议收发 JSON-RPC 消息的要求 ([Transports - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/transports#:~:text=interface%20Transport%20,void)) ([Transports - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/transports#:~:text=%2F%2F%20Callbacks%20onclose%3F%3A%20%28%29%20%3D,void%3B))。

## MCP核心功能：工具、资源与提示

MCP 服务器可以向客户端提供三大类核心能力：**资源（Resources）**、**工具（Tools）**和**提示模板（Prompts）** ([For Server Developers - Model Context Protocol](https://modelcontextprotocol.io/quickstart/server#:~:text=MCP%20servers%20can%20provide%20three,main%20types%20of%20capabilities))。这几种能力定义了模型可以获取的上下文或可执行的操作。下面分别介绍它们的机制及用法，并说明 MCP 如何在协议/API 层实现这些功能，使模型能力得以扩展。

### 资源（Resources）共享机制

**资源**指由服务器暴露的、可供读取的静态数据内容，例如文件内容、数据库记录、API返回的数据、日志、图像等 ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=Resources%20are%20a%20core%20primitive,as%20context%20for%20LLM%20interactions)) ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=,And%20more))。资源相当于**模型的只读上下文**：LLM 可以将其视作参考资料。资源有以下特点：

- **唯一URI标识**：每个资源由类似URL的URI标识符表示，以 `协议://主机/路径` 格式命名 ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=Resource%20URIs))。例如 `file:///home/user/documents/report.pdf` 指本地文件，`postgres://database/customers/schema` 指数据库架构 ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=Resources%20are%20identified%20using%20URIs,that%20follow%20this%20format))。统一的URI便于模型引用资源。
- **类型与内容**：资源分为文本和二进制两类。文本资源包含UTF-8文本（源码、配置、日志等） ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=Text%20resources))；二进制资源包含Base64编码的数据（图片、PDF、音频等） ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=Binary%20resources))。服务器在提供资源时会标注 MIME 类型方便识别 ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=Each%20resource%20includes%3A))。
- **发现与读取**：客户端通过 `resources/list` 请求获取服务器提供的所有资源列表 ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=Direct%20resources))。每项资源包含 URI、名称、描述、MIME 类型等元数据 ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=,Optional%20MIME%20type))。对于动态资源，服务器还可提供**URI 模板**，客户端根据模板填参数构造URI 来访问 ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=Resource%20templates)) ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=,for%20all%20matching%20resources))。当需要使用某个资源时，客户端发送 `resources/read` 请求并附上资源URI，服务器会返回该资源的内容 ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=To%20read%20a%20resource%2C%20clients,request%20with%20the%20resource%20URI))。响应中以 `contents` 列表形式给出资源内容，可以一次返回一个或多个资源（例如读取一个目录时返回目录下多个文件） ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=contents%3A%20%5B%20,%2F%2F%20Optional%20MIME%20type)) ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=))。
- **应用控制**：重要的是，资源的使用通常是**由应用或用户控制**的 ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=Resources%20are%20designed%20to%20be,For%20example))。例如 Claude Desktop 要求用户显式选择哪些资源可以提供给模型 ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=may%20handle%20resources%20differently,example))。也有的客户端可能用启发式自动选择资源，甚至允许 AI 模型自行请求资源 ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=,determine%20which%20resources%20to%20use))。但默认情况下，资源不会自动送入模型上下文，必须经过用户或客户端确认。这样可以避免模型任意读取敏感数据。如果希望模型自主获取外部信息，更适合用后述的“工具”机制 ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=Server%20authors%20should%20be%20prepared,controlled%20primitive%20such%20as%20Tools))。

资源机制主要让模型在回答时有**额外的背景知识**。比如，用户让模型分析一份日志文件，用户或应用即可通过资源接口把日志文件内容提供给模型，然后模型在回答中引用这些内容。资源接口保持“读”语义，不涉及改变外部状态，因此安全性较高。典型用法示例（服务器端实现）：

```typescript
const server = new Server({ name: 'example-server', version: '1.0.0' }, {
  capabilities: { resources: {} }
})

// 列出可用资源
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'file:///logs/app.log',
        name: 'Application Logs',
        mimeType: 'text/plain'
      }
    ]
  }
})

// 读取资源内容
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri
  if (uri === 'file:///logs/app.log') {
    const logContents = await readLogFile()
    return {
      contents: [
        {
          uri,
          mimeType: 'text/plain',
          text: logContents
        }
      ]
    }
  }
  throw new Error('Resource not found')
})
```

上面代码演示了在 MCP 服务器中实现资源支持的基本模式 ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=%2F%2F%20List%20available%20resources%20server,)) ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=%2F%2F%20Read%20resource%20contents%20server,uri))。服务器声明提供 `resources` 功能，然后：

- 在 `ListResources` 请求中返回一个资源列表（此处仅有一个日志文件资源） ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=%2F%2F%20List%20available%20resources%20server,))。
- 在 `ReadResource` 请求中，根据请求的 URI 读取实际内容并返回（示例中读取日志文件内容并作为文本返回） ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=%2F%2F%20Read%20resource%20contents%20server,uri)) ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=contents%3A%20%5B%20,%5D))。

客户端收到资源内容后，就可以将其送入模型上下文，让模型据此回答问题。由于资源通常需要用户同意才提供，这保证了模型只能访问用户允许的内容，从而增强了安全性和可控性。

### 工具（Tools）调用机制

**工具**是 MCP 中非常强大的原语，它代表服务器提供的一种可执行操作（函数），模型可以请求执行该操作，并将结果纳入对话 ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=Tools%20are%20a%20powerful%20primitive,actions%20in%20the%20real%20world))。通过工具机制，LLM 获得了**与外部世界互动**的能力，包括查询外部服务、执行计算、修改状态等。“工具”相当于 ChatGPT 插件或函数调用的概念，但 MCP 将其标准化为协议的一部分。

工具具备以下要点 ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=Tools%20are%20a%20powerful%20primitive,actions%20in%20the%20real%20world)) ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=,calculations%20to%20complex%20API%20interactions))：

- **模型可控，需用户批准**：工具的设计初衷是供 AI 模型自动调用（model-controlled），但调用时通常需要人类在环审核/批准 ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=Tools%20are%20designed%20to%20be,the%20loop%20to%20grant%20approval))。也就是说，模型可以在对话中自主决定使用哪个工具（以及参数），但客户端在真正执行前应让用户确认。这类似 ChatGPT 插件调用时会提示用户授权。
- **发现（Discovery）**：客户端可通过调用服务器的 `tools/list` 接口来获取其提供的所有工具列表 ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=,calculations%20to%20complex%20API%20interactions))。服务器会返回每个工具的定义，包括**名称**（唯一标识）、**描述**（用途说明）、**输入参数模式**（参数的JSON Schema定义）等 ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=,calculations%20to%20complex%20API%20interactions)) ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=Each%20tool%20is%20defined%20with,the%20following%20structure))。这相当于告诉模型“我有哪些工具、怎么用”。例如，一个计算求和的工具可能定义为：名称 `"calculate_sum"`，描述 `"Add two numbers together"`，输入Schema要求提供两个数字参数 `a` 和 `b` ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=%2F%2F%20Define%20available%20tools%20server,)) ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=name%3A%20,))。
- **调用（Invocation）**：一旦模型（经过用户许可）决定使用某工具，客户端会向服务器发起 `tools/call` 请求，指定要调用的工具名称和参数 ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=,calculations%20to%20complex%20API%20interactions))。服务器接收到请求后执行相应操作，并将结果打包返回 ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=,calculations%20to%20complex%20API%20interactions))。结果通常以**内容项（content）**的形式给出，可以是文本、图像等类型。 ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=%2F%2F%20Handle%20tool%20execution%20server,text%3A%20String%28a%20%2B%20b))例如，针对前述 `"calculate_sum"` 工具，服务器执行后返回结果文本 `"5"`（假设参数 a=2, b=3） ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=if%20%28request.params.name%20%3D%3D%3D%20,))。客户端再将此结果提供给模型，模型即可继续对话并利用该结果。
- **丰富的操作范围**：工具可以代表各种操作，从简单计算、一段代码执行，到复杂的API调用，甚至控制机器人等 ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=perform%20the%20requested%20operation%20and,calculations%20to%20complex%20API%20interactions))。例如：

  - _系统操作类工具_：如 `"execute_command"` 在宿主机器上执行Shell命令 ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=Tools%20that%20interact%20with%20the,local%20system))。
  - _外部API集成工具_：如 `"github_create_issue"` 调用GitHub API新建issue ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=API%20integrations))。
  - _数据处理工具_：如 `"analyze_csv"` 读取并分析CSV文件数据 ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=%7B%20name%3A%20,array))。

  通过定义不同的工具，MCP 服务器几乎可以把任何可编程操作暴露给模型使用。

工具机制的**技术实现**在 MCP 协议层体现为两个主要方法：`tools/list` 和 `tools/call`。模型在对话过程中可以先请求工具列表了解可用操作，再决定调用哪个工具 ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=,calculations%20to%20complex%20API%20interactions))。值得注意的是，MCP 工具的参数模式直接使用 **JSON Schema** 定义 ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=Each%20tool%20is%20defined%20with,the%20following%20structure))。这类似于 OpenAPI 的方式：明确列出每个参数的类型、是否必需等。有了 JSON Schema，客户端（以及模型）就可以准确地构造调用参数，避免格式错误。

让我们看一个具体**代码示例**，展示如何在 MCP 服务器中实现一个简单工具，并处理调用：

```typescript
const server = new Server({ name: 'example-server', version: '1.0.0' }, {
  capabilities: { tools: {} }
})

// 定义可用工具列表的处理器
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [{
      name: 'calculate_sum',
      description: 'Add two numbers together',
      inputSchema: {
        type: 'object',
        properties: {
          a: { type: 'number' },
          b: { type: 'number' }
        },
        required: ['a', 'b']
      }
    }]
  }
})

// 处理工具调用请求
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'calculate_sum') {
    const { a, b } = request.params.arguments
    return {
      content: [
        { type: 'text', text: String(a + b) }
      ]
    }
  }
  throw new Error('Tool not found')
})
```

上述代码在服务器侧实现了一个 “求和” 工具 ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=%2F%2F%20Define%20available%20tools%20server,)) ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=%2F%2F%20Handle%20tool%20execution%20server,text%3A%20String%28a%20%2B%20b))。步骤说明：

- 初始化服务器时声明具备 `tools` 功能。
- 拦截 `tools/list` 请求并返回包含一个 `calculate_sum` 工具的数组 ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=%2F%2F%20Define%20available%20tools%20server,)) ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=name%3A%20,b))。可以看到我们为它提供了名称、描述，以及输入参数 schema（要求两个数字）。
- 拦截 `tools/call` 请求：如果请求的工具名称匹配 `calculate_sum`，则取出参数 `a` 和 `b` 执行求和，将结果转成文本内容返回 ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=%2F%2F%20Handle%20tool%20execution%20server,text%3A%20String%28a%20%2B%20b))。如果名称不匹配，则抛出错误。

有了这个服务器，任何支持 MCP 的客户端（如 Claude Desktop）连上后，就能让模型使用到 `calculate_sum` 工具了。模型可能在与用户对话中说：“让我调用 _calculate_sum_ 工具计算2+3”，一旦用户批准，客户端就按上述逻辑调用服务器获取结果“5”，然后再把结果反馈给模型继续对话。这实现了**LLM 调用外部函数**的闭环。

从开发者角度看，MCP 工具机制与 OpenAI 的函数调用或插件机制有异曲同工之处，但**更开放灵活**。开发者可以使用 MCP SDK 方便地注册任意函数作为工具，定义参数 schema，并通过统一协议供模型调用。同时MCP规定了**安全控制**：客户端需要就调用请求征得用户同意，服务器也可以在实现中做参数校验、错误处理等（例如代码中对未知工具名抛错），以免模型滥用工具。通过合理设计工具名称和描述，还可以引导模型正确地选择和使用工具 ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=Best%20practices))（例如提供清晰用途说明、示例等）。

### 提示模板（Prompts）机制

除了资源和工具，MCP 还支持由服务器提供**预定义的提示模板**，帮助标准化和复用常见的对话流程 ([Prompts - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/prompts#:~:text=Prompts%20enable%20servers%20to%20define,and%20share%20common%20LLM%20interactions))。这些**Prompts**类似于一种“对话宏”或预设指令，用户可以快捷调用。其特点包括 ([Prompts - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/prompts#:~:text=Prompts%20enable%20servers%20to%20define,and%20share%20common%20LLM%20interactions)) ([Prompts - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/prompts#:~:text=Overview))：

- **可参数化**：提示模板可以预留参数位置，客户端调用时提供参数值，将其填入模板中 ([Prompts - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/prompts#:~:text=Overview)) ([Prompts - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/prompts#:~:text=%7B%20name%3A%20%22analyze,required%3A%20true))。
- **可嵌入资源**：模板内容中可以嵌入资源引用，让返回的对话消息直接含有某些资源内容 ([Prompts - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/prompts#:~:text=Embedded%20resource%20context)) ([Prompts - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/prompts#:~:text=,%7D))。
- **多轮对话**：一个提示模板可以包含多条消息（如用户和助手角色），用于引导模型执行特定流程 ([Prompts - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/prompts#:~:text=messages%3A%20%5B%20%7B%20role%3A%20,n)) ([Prompts - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/prompts#:~:text=Dynamic%20prompts))。
- **用户触发**：Prompts 通常是**用户控制**使用的 ([Prompts - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/prompts#:~:text=Prompts%20are%20designed%20to%20be,explicitly%20select%20them%20for%20use))。也就是说由用户在界面上选择某个提示（比如点击一个预设任务按钮），客户端才调用模板，将生成的消息发送给模型。

在协议上，Prompts 提供了两个主要接口：`prompts/list` 和 `prompts/get`。顾名思义，前者列出可用的提示模板列表，后者获取某个模板具体展开后的消息内容 ([Prompts - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/prompts#:~:text=Clients%20can%20discover%20available%20prompts,endpoint)) ([Prompts - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/prompts#:~:text=To%20use%20a%20prompt%2C%20clients,request))。例如，假设服务器有一个 `"explain-code"` 提示模板，用于请模型解释代码，它定义了两个参数：`code`（必填，要解释的代码）和`language`（可选，代码语言） ([Prompts - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/prompts#:~:text=%22explain,required%3A%20true))。客户端调用 `prompts/get` 时提供模板名和参数，服务器返回一组消息，如一条用户消息：“请解释这段 Python 代码的作用：<代码内容>” ([Prompts - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/prompts#:~:text=if%20%28request.params.name%20%3D%3D%3D%20%22git,request.params.arguments%3F.changes)) ([Prompts - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/prompts#:~:text=if%20%28request.params.name%20%3D%3D%3D%20%22explain,request.params.arguments%3F.code))。客户端随后会将这些消息直接交给模型，使模型明白要执行的任务。

Prompts 的意义在于**复用专家经验**。开发者可以将常用的对话提示（包括复杂的系统指令或多步骤提示）封装到服务器中。一方面，普通用户不用自己编写复杂提示就能使用这些功能；另一方面，这些模板也能确保模型交互流程的一致性和可靠性。例如，一个“生成 Git 提交信息”的模板可以确保每次都提示模型产出简洁有描述性的提交备注 ([Prompts - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/prompts#:~:text=if%20%28request.params.name%20%3D%3D%3D%20%22git,but%20descriptive%20commit%20message%20for))。

### 进阶：采样（Sampling）与其他能力

MCP 还定义了一些进阶功能，例如**采样（Sampling）**机制，允许服务器反过来请求客户端调用LLM来完成某些子任务 ([Sampling - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/sampling#:~:text=Let%20your%20servers%20request%20completions,from%20LLMs))。简单来说，服务器可以发送 `sampling/createMessage` 请求，让客户端代为向模型询问问题并获得回复，再将回复结果返回给服务器 ([Sampling - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/sampling#:~:text=The%20sampling%20flow%20follows%20these,steps))。这为实现复杂的**Agent**行为提供了可能：服务器本身也可以借助LLM来决策。例如当一个工具需要多步骤推理时，服务器可以用Sampling向模型要一个计划或分析结果，再据此执行后续操作 ([Sampling - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/sampling#:~:text=Agentic%20workflows))。整个采样过程有人类在环监督：客户端在发送前、返回结果前都可让用户审核或编辑 ([Sampling - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/sampling#:~:text=Human%20in%20the%20loop%20controls)) ([Sampling - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/sampling#:~:text=For%20completions))。不过目前 Anthropic 的 Claude 桌面版尚未支持该特性 ([Sampling - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/sampling#:~:text=maintaining%20security%20and%20privacy))。

另外，MCP 引入**Roots（根路径）**概念，让客户端在连接时指定服务器应关注的资源范围（如限定文件系统根目录等），防止越权访问 ([Roots - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/roots#:~:text=What%20are%20Roots%3F)) ([Roots - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/roots#:~:text=How%20Roots%20Work))。传输层方面，我们前面提到支持 stdio、本地进程和 SSE 等，开发者也可扩展自定义传输 ([Transports - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/transports#:~:text=interface%20Transport%20,void))。所有这些机制共同构成了 MCP 完整的能力集，使其既能满足简单工具调用，又能胜任复杂、安全的模型集成需求。

## MCP的集成与模型扩展

MCP 对开发者友好，提供了多语言的 SDK（目前有 Python、TypeScript、Java、Kotlin 等 ([Introduction - Model Context Protocol](https://modelcontextprotocol.io/introduction#:~:text=,Specification))），方便在项目中集成 MCP 客户端或服务器。借助 MCP，**外部开发者**可以轻松为现有的 LLM 应用扩展新功能，具体方式包括：

- **开发自定义 MCP 服务器**：开发者可以创建一个 MCP 服务器，包装自己提供的功能或数据源，然后任何支持 MCP 的宿主应用都能连接这个服务器，使得模型具备该服务器提供的新能力。例如，你有一套业务数据库，希望 ChatGPT/Claude 能查询其中数据，可以编写一个 MCP 服务器将数据库查询作为资源或工具暴露出来；然后在 Claude Desktop 中连接此服务器，Claude 就能访问数据库内容回答问题。又或者你开发了一个新算法，可以作为模型工具调用（类似 ChatGPT 函数），同样能通过 MCP 对外提供。**这就像为模型打造插件**：但与传统插件不同的是，它是基于开放标准实现，一次开发，各处通用。
- **集成 MCP 客户端到应用**：如果你在构建自己的 LLM 应用（比如一个定制聊天机器人客户端），也可以在应用中加入 MCP 客户端功能，让你的应用能对接所有 MCP 服务器 ([For Server Developers - Model Context Protocol](https://modelcontextprotocol.io/quickstart/server#:~:text=We%E2%80%99ll%20build%20a%20server%20that,this%20case%2C%20Claude%20for%20Desktop))。这样，你的应用相当于具备了调用“通用插件”的能力——只要有人开发了新的 MCP 服务器，你的应用和模型就马上能用上它。Anthropic 提供了“客户端开发者快速上手”指南，以帮助开发者将 MCP 整合进自己的软件 ([For Server Developers - Model Context Protocol](https://modelcontextprotocol.io/quickstart/server#:~:text=Then%20we%E2%80%99ll%20connect%20the%20server,this%20case%2C%20Claude%20for%20Desktop))。

MCP 已经形成了一个**生态体系**。官方维护了一系列参考实现的服务器，涵盖多种用途 ([Example Servers - Model Context Protocol](https://modelcontextprotocol.io/examples#:~:text=This%20page%20showcases%20various%20Model,access%20tools%20and%20data%20sources))：

- **数据与文件**：如 _Filesystem_ 文件系统服务器（安全的文件操作）、_PostgreSQL/SQLite_ 数据库查询服务器、_Google Drive_ 云盘文件访问等 ([Example Servers - Model Context Protocol](https://modelcontextprotocol.io/examples#:~:text=Data%20and%20file%20systems))。
- **开发工具**：如 _Git/GitHub/GitLab_ 服务器（仓库读取、操作，集成相应平台API）、_Sentry_ 服务器（获取错误日志）等 ([Example Servers - Model Context Protocol](https://modelcontextprotocol.io/examples#:~:text=Development%20tools))。
- **网页和浏览**：如 _Brave Search_（网络搜索接口）、_Fetch_（通用网页抓取）、_Puppeteer_（无头浏览器操作）等 ([Example Servers - Model Context Protocol](https://modelcontextprotocol.io/examples#:~:text=Web%20and%20browser%20automation))。
- **生产力与通信**：如 _Slack_（团队聊天操作）、_Google Maps_（地图和位置服务）、_Memory_（知识图谱式的持久记忆库）等 ([Example Servers - Model Context Protocol](https://modelcontextprotocol.io/examples#:~:text=%2A%20Slack%20,based%20persistent%20memory%20system))。
- **AI 与其他**：如 _EverArt_（图像生成）、_Sequential Thinking_（复杂问题分解代理）、_AWS KB Retrieval_（AWS知识库检索）等 ([Example Servers - Model Context Protocol](https://modelcontextprotocol.io/examples#:~:text=AI%20and%20specialized%20tools))。

除此之外，一些厂商也为自家产品提供了官方 MCP 集成（如 _Cloudflare_、_Stripe_ 等服务器 ([Example Servers - Model Context Protocol](https://modelcontextprotocol.io/examples#:~:text=These%20MCP%20servers%20are%20maintained,by%20companies%20for%20their%20platforms)) ([Example Servers - Model Context Protocol](https://modelcontextprotocol.io/examples#:~:text=%2A%20Qdrant%20,the%20Tinybird%20serverless%20ClickHouse%20platform))），社区开发者亦贡献了大量创意服务器（如 _Docker_ 管理、_Kubernetes_ 操作、_Spotify_ 播放控制等 ([Example Servers - Model Context Protocol](https://modelcontextprotocol.io/examples#:~:text=A%20growing%20ecosystem%20of%20community,servers%20extends%20MCP%E2%80%99s%20capabilities))）。这个列表仍在快速增长中 ([Example Servers - Model Context Protocol](https://modelcontextprotocol.io/examples#:~:text=For%20a%20complete%20list%20of,visit%20the%20MCP%20Servers%20Repository))。如此繁荣的生态证明了 MCP 作为**标准化“模型插件”接口**的价值——开发者构建一个 MCP 服务器，就有机会被多个支持 MCP 的平台共用，从而极大提升了模型的能力范围 ([
AI Is Making Websites Obsolete With MCP | PulseMCP
](https://www.pulsemcp.com/posts/ai-is-making-websites-obsolete-with-mcp#:~:text=1,all%20these%20different%20AI%20apps))。

例如，有开发者已经将 MCP 集成到 IDE 助手、独立聊天应用等不同场景中 ([Example Clients - Model Context Protocol](https://modelcontextprotocol.io/clients#:~:text=Feature%20support%20matrix))。Claude Desktop 是目前对 MCP 支持最完整的宿主之一 ([Example Clients - Model Context Protocol](https://modelcontextprotocol.io/clients#:~:text=ClientResources%20%2014Tools%20%2016Roots,Framework%E2%9D%8C%E2%9D%8C%E2%9C%85%E2%9D%8C%E2%9D%8CSupports%20tools%20in%20agentic%20workflows))（支持资源、提示、工具），其他如 Continue、Cursor、Emacs 等项目也已支持部分 MCP 功能 ([Example Clients - Model Context Protocol](https://modelcontextprotocol.io/clients#:~:text=ClientResources%20%2014Tools%20%2016Roots,Framework%E2%9D%8C%E2%9D%8C%E2%9C%85%E2%9D%8C%E2%9D%8CSupports%20tools%20in%20agentic%20workflows))。这意味着，不同模型和应用通过 MCP **共享同一套工具/资源插件**成为可能。正如有人评价的：“不需要为 ChatGPT 开发一套插件、为 Cursor 再开发一套，构建一个 MCP 服务器就能服务所有这些不同的 AI 应用” ([
AI Is Making Websites Obsolete With MCP | PulseMCP
](https://www.pulsemcp.com/posts/ai-is-making-websites-obsolete-with-mcp#:~:text=dashboards%2C%20email%20clients%2C%20and%20so,all%20these%20different%20AI%20apps))。

在实际开发中，启动并连接 MCP 服务器通常也很简单。以 Python SDK 为例，可以用几行代码创建服务器并通过 stdio 等方式侦听 ([Transports - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/transports#:~:text=const%20server%20%3D%20new%20Server%28,))：

```python
from mcp.server import Server
from mcp.transport.stdio import StdioServerTransport

server = Server({"name": "my-server", "version": "0.1.0"}, {"capabilities": {"tools": {}}})
# （此处省略注册工具/资源的 handler，可参考前述示例）
transport = StdioServerTransport()
await server.connect(transport)
```

上述代码创建了一个具备 tools 功能的服务器并以标准IO作为传输启动监听 ([Transports - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/transports#:~:text=const%20server%20%3D%20new%20Server%28,))。如果你将此服务器可执行文件配置给 Claude Desktop，它就会在对话界面出现相应的工具供模型调用（Claude 界面会显示一个小锤子图标，表示可用工具数量） ([Model Context Protocol | Hacker News](https://news.ycombinator.com/item?id=42237424#:~:text=You%20need%20to%20know%3A))。对于网络部署的服务器，则可以使用 SSE 模式，通过HTTP路由通信 ([Transports - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/transports#:~:text=import%20express%20from%20)) ([Transports - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/transports#:~:text=let%20transport%3A%20SSEServerTransport%20,null))。无论传输层如何，实现细节都被 SDK 封装好了，开发者可以专注于实现具体功能逻辑。

综上，MCP 为开发者提供了**扩展大模型能力的通用接口**。通过编写 MCP 服务器，外部开发者可以将**任何数据源或功能**嫁接给 LLM；通过支持 MCP 的客户端/宿主，模型瞬间获得成百上千的新技能。在保证安全可控的前提下，MCP 极大拓展了 LLM 的应用边界。

## MCP 与 OpenAI ChatGPT 插件机制对比

OpenAI 的 ChatGPT 插件机制是目前广为人知的让模型调用外部API的方案，那么它和 MCP 有何异同？下面我们从原理和适用场景上对比二者。

**1. 架构和开放性**：最大的区别在于**适用范围和开放程度**。ChatGPT 插件是 OpenAI 针对 ChatGPT 平台设计的封闭方案，只能在 ChatGPT 产品中使用 ([
AI Is Making Websites Obsolete With MCP | PulseMCP
](https://www.pulsemcp.com/posts/ai-is-making-websites-obsolete-with-mcp#:~:text=1,Build%20one%2C%20and%20you))。开发者为 ChatGPT 编写的插件无法直接在其他 LLM 或应用中复用。而 MCP 是一个独立的**开放标准**，**不绑定特定模型或应用** ([
AI Is Making Websites Obsolete With MCP | PulseMCP
](https://www.pulsemcp.com/posts/ai-is-making-websites-obsolete-with-mcp#:~:text=1,all%20these%20different%20AI%20apps))。任何支持 MCP 的 AI 应用都能使用所有 MCP 服务器提供的功能。这意味着，用 MCP 开发的“一次”可以被不同平台反复利用 ([
AI Is Making Websites Obsolete With MCP | PulseMCP
](https://www.pulsemcp.com/posts/ai-is-making-websites-obsolete-with-mcp#:~:text=dashboards%2C%20email%20clients%2C%20and%20so,all%20these%20different%20AI%20apps))。举例来说，如果你用 MCP 做了个数据库查询工具，Claude、ChatGPT（假如未来支持MCP）、开源模型前端等都能接入使用；反之，ChatGPT 插件只能服务于ChatGPT本身，若要在别的环境（比如本地AI助手）实现类似功能，得另写一套接口代码。MCP 的标准化和开源特性，使其更像是**AI 时代的通用插件标准**。

**2. 工具调用方式**：ChatGPT 插件和 MCP 工具在调用方式上也有所不同。ChatGPT 插件采用的是**RESTful API + OpenAPI**的方式 ([The Open API is set as the Standard for ChatGPT Plugins](https://apidog.com/articles/chatgpt-plugins-open-api/#:~:text=Plugin%20developers%20specify%20one%20or,API%20to%20perform%20the%20operation))。插件开发者需要提供一个 `.well-known/ai-plugin.json` 清单和 OpenAPI 文档，定义插件的HTTP接口；ChatGPT 模型会读取这些说明，在对话中自行决定什么时候调用哪个HTTP接口，并以正确的JSON参数发起请求 ([The Open API is set as the Standard for ChatGPT Plugins](https://apidog.com/articles/chatgpt-plugins-open-api/#:~:text=Plugin%20developers%20specify%20one%20or,API%20to%20perform%20the%20operation))。可以理解为**模型充当API调用者**，根据提供的API规范和使用说明主动调用插件接口 ([The Open API is set as the Standard for ChatGPT Plugins](https://apidog.com/articles/chatgpt-plugins-open-api/#:~:text=Plugin%20developers%20specify%20one%20or,API%20to%20perform%20the%20operation))。而 MCP 工具调用基于**JSON-RPC 双向通信**，由宿主客户端和服务器交互实现。模型在对话中表达调用意图后，实际由客户端发送`tools/call`请求给服务器，获取结果再返回模型。两者对比：

- **ChatGPT 插件**：一次插件调用即一次HTTP请求-响应。插件服务需部署在公网可访问的地址，OpenAI服务器代理模型发起请求并拿到结果。模型何时调用完全由OpenAI的调度策略和模型推理决定 ([The Open API is set as the Standard for ChatGPT Plugins](https://apidog.com/articles/chatgpt-plugins-open-api/#:~:text=Plugin%20developers%20specify%20one%20or,API%20to%20perform%20the%20operation))。调用前后，用户并不直接干预（除了最初安装授权插件）。整个过程封闭在 ChatGPT 平台内。
- **MCP 工具**：工具通常运行在本地或开发者控制的环境，通过MCP客户端-服务器长连接通信（可本地可远程）。模型何时调用取决于对话引导，且**通常有用户在环确认**。每次调用是 JSON-RPC 消息交互，可以更丰富（支持流式输出、二进制数据传输等，ChatGPT插件目前主要传文本/JSON）。由于 MCP 在客户端和服务器两侧都有实现，因而可以实现**双向实时通信**（例如服务器通知客户端有新资源，或客户端取消长时间运行的工具等），而 ChatGPT 插件主要是一问一答式的HTTP交互。

**3. 功能覆盖与场景**：ChatGPT 插件的初衷是“让 ChatGPT 实时获取信息、执行计算或调用第三方服务” ([ChatGPT plugins | OpenAI](https://openai.com/index/chatgpt-plugins/#:~:text=We%E2%80%99ve%20implemented%20initial%20support%20for,party%20services))。事实上，OpenAI提供了浏览、代码执行等官方插件，也鼓励第三方插件实现查询实时数据、检索自有知识库、代表用户执行操作等功能 ([The Open API is set as the Standard for ChatGPT Plugins](https://apidog.com/articles/chatgpt-plugins-open-api/#:~:text=following%20capabilities%3A))。这一点和 MCP 的目标一致：都是为了给LLM接入外部世界能力。不过，ChatGPT 插件当前更多聚焦在**Web服务/API**的调用，例如查询票务、下单、获取知识库问答等 ([The Open API is set as the Standard for ChatGPT Plugins](https://apidog.com/articles/chatgpt-plugins-open-api/#:~:text=following%20capabilities%3A))。MCP 则不仅覆盖这些互联网服务，也非常注重**本地和企业场景**。像文件系统访问、本地数据库查询、内网工具等，使用 MCP 更为直接安全（因为服务器就运行在本地/内网，数据不必经第三方云）。因此：

- 如果你的需求是在 ChatGPT 网站上提供一个公众可用的服务（如酒店预订查询），插件是不错的选择，因为 ChatGPT 拥有大量终端用户。
- 如果你的需求是构建**自有的智能应用**（如公司内部的AI助手，需要访问内部资料或工具），或者让模型接入**私有数据**，MCP 会更适合，因为它在你的控制下、采用安全直连的方式，不需要把公司数据暴露给OpenAI云端。MCP 还能灵活部署在各种环境（本地进程、私有服务器），满足企业合规要求。

**4. 安全与审核**：OpenAI 插件有一套严格的审核与沙箱机制，确保模型不会滥用插件造成危害，并对每个插件有调用次数等限制。用户在ChatGPT中只能启用至多几个插件一起使用，而且OpenAI会在提示中加入说明指导模型何时用插件 ([ChatGPT plugins | OpenAI](https://openai.com/index/chatgpt-plugins/#:~:text=Plugin%20developers%20who%20have%20been,opens%20in%20a%20new%20window))。MCP 则把这部分责任交给**客户端应用**和**开发者**。客户端需要做好用户授权界面（例如Claude Desktop在模型调用工具前弹出确认），开发者在服务器实现中也应考虑滥用风险（例如对危险操作增加确认或权限控制）。从某种角度看，MCP 提供了一个更底层的标准，如何构建安全策略可以由不同客户端自行决定，从而适配多样的使用场景。

**5. 社区与生态**：MCP 背靠 Anthropic 及开源社区，正逐渐形成跨平台的生态（如前述多款 IDE、应用支持 MCP）。ChatGPT 插件则目前局限于 ChatGPT 平台自身的生态（插件商店）。如果OpenAI未来也支持 MCP，那么ChatGPT 用户将立即获得大量 MCP 工具的接入 ([
AI Is Making Websites Obsolete With MCP | PulseMCP
](https://www.pulsemcp.com/posts/ai-is-making-websites-obsolete-with-mcp#:~:text=It%27s%20a%20great%20gesture%20by,hard%20at%20work%20building%20today))；但在此之前，这两个生态仍是分开的。对开发者来说，ChatGPT 插件可以直接触达ChatGPT庞大用户，但需要遵循OpenAI规则并通过审核上线。而 MCP 服务器可以自由发布在GitHub等处，供任意有需要的用户/应用使用，更加**开源自主**。正如业界评论所说：“ChatGPT插件的作用止于ChatGPT本身；MCP 则面向整个AI应用生态，开放标准意味着某人开发的积木能让所有人受益” ([
AI Is Making Websites Obsolete With MCP | PulseMCP
](https://www.pulsemcp.com/posts/ai-is-making-websites-obsolete-with-mcp#:~:text=1,all%20these%20different%20AI%20apps))。

总的来说，**ChatGPT 插件**和**MCP**的关系类似“专有 vs 标准”。前者是特定平台的扩展机制，适合在该平台内提供服务；后者是通用标准，旨在连接各种模型与工具，赋予开发者更大的自主权和应用范围。在未来的工具型 AI 世界里，两者很可能并行发展。对于开发者而言，理解并善用这两种机制，将有助于在不同舞台上拓展 AI 的能力：在 ChatGPT 上构建大众应用，用 MCP 打造跨平台的通用插件，满足更广泛的智能化需求。

**参考文献：**

1. Anthropic, _“Model Context Protocol: Introduction”_, modelcontextprotocol.io ([Introduction - Model Context Protocol](https://modelcontextprotocol.io/introduction#:~:text=MCP%20is%20an%20open%20protocol,different%20data%20sources%20and%20tools)) ([Introduction - Model Context Protocol](https://modelcontextprotocol.io/introduction#:~:text=MCP%20helps%20you%20build%20agents,and%20tools%2C%20and%20MCP%20provides))

2. Anthropic, _“Model Context Protocol: General architecture”_, modelcontextprotocol.io ([Introduction - Model Context Protocol](https://modelcontextprotocol.io/introduction#:~:text=At%20its%20core%2C%20MCP%20follows,can%20connect%20to%20multiple%20servers)) ([Introduction - Model Context Protocol](https://modelcontextprotocol.io/introduction#:~:text=At%20its%20core%2C%20MCP%20follows,can%20connect%20to%20multiple%20servers))

3. Anthropic, _“Model Context Protocol: Resources”_, modelcontextprotocol.io ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=Direct%20resources)) ([Resources - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/resources#:~:text=To%20read%20a%20resource%2C%20clients,request%20with%20the%20resource%20URI))

4. Anthropic, _“Model Context Protocol: Tools”_, modelcontextprotocol.io ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=Tools%20are%20a%20powerful%20primitive,actions%20in%20the%20real%20world)) ([Tools - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/tools#:~:text=,calculations%20to%20complex%20API%20interactions))

5. Anthropic, _“Model Context Protocol: Prompts”_, modelcontextprotocol.io ([Prompts - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/prompts#:~:text=Clients%20can%20discover%20available%20prompts,endpoint)) ([Prompts - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/prompts#:~:text=To%20use%20a%20prompt%2C%20clients,request))

6. Anthropic, _“Model Context Protocol: Sampling”_, modelcontextprotocol.io ([Sampling - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/sampling#:~:text=Let%20your%20servers%20request%20completions,from%20LLMs)) ([Sampling - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/sampling#:~:text=Human%20in%20the%20loop%20controls))

7. Anthropic, _“Model Context Protocol: Transports”_, modelcontextprotocol.io ([Transports - Model Context Protocol](https://modelcontextprotocol.io/docs/concepts/transports#:~:text=MCP%20uses%20JSON,back%20into%20MCP%20protocol%20messages))

8. Anthropic, _“Example Servers – MCP”_, modelcontextprotocol.io ([Example Servers - Model Context Protocol](https://modelcontextprotocol.io/examples#:~:text=Data%20and%20file%20systems)) ([Example Servers - Model Context Protocol](https://modelcontextprotocol.io/examples#:~:text=Development%20tools))

9. Pulsemcp Blog, _“Why Claude and ChatGPT need connections to external services… MCP vs ChatGPT plugins”_, pulsemcp.com ([
   AI Is Making Websites Obsolete With MCP | PulseMCP
   ](https://www.pulsemcp.com/posts/ai-is-making-websites-obsolete-with-mcp#:~:text=1,all%20these%20different%20AI%20apps))

10. Apidog Blog, _“The OpenAPI is set as the Standard for ChatGPT Plugins”_, apidog.com ([The Open API is set as the Standard for ChatGPT Plugins](https://apidog.com/articles/chatgpt-plugins-open-api/#:~:text=Plugin%20developers%20specify%20one%20or,API%20to%20perform%20the%20operation))

11. OpenAI, _“ChatGPT plugins announcement”_, openai.com ([ChatGPT plugins | OpenAI](https://openai.com/index/chatgpt-plugins/#:~:text=We%E2%80%99ve%20implemented%20initial%20support%20for,party%20services))
