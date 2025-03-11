# MCP演示项目

这个项目包含了一个介绍AI开发接口演进的幻灯片，从基础聊天API到Function Call、ChatGPT插件，最终详细介绍MCP（Model Context Protocol）。

## 幻灯片

使用[Slidev](https://sli.dev/)构建的交互式幻灯片，面向没有接触过AI开发的程序员。

### 运行幻灯片

```bash
# 安装依赖
npm install

# 启动幻灯片开发服务器
npm run dev

# 构建幻灯片
npm run build

# 导出为PDF
npm run export
```

## MCP服务器示例

项目中包含一个简单的MCP服务器示例 `hello-server.js`，可以用来演示MCP的基本功能。

### 运行服务器

```bash
# 安装依赖
npm install

# 启动MCP服务器
npm start
```

然后在Claude Desktop中添加此服务器，就可以使用"hello_world"工具了。

## 内容结构

- `slides.md`: 主幻灯片文件
- `parts/`: 幻灯片各部分内容
- `components/`: 自定义Vue组件
- `hello-server.js`: MCP服务器示例
- `public/`: 静态资源文件

## 学习资源

- [MCP官方文档](https://modelcontextprotocol.io/)
- [Function Call官方文档](https://platform.openai.com/docs/guides/function-calling)
- [ChatGPT插件文档](https://platform.openai.com/docs/plugins/introduction) 