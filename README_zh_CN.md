你好，未来的思源笔记创作者！

欢迎阅读这份为自定义块（Custom Block）量身打造的新手指南。本指南旨在帮助像你一样，希望在思源笔记中创造出强大交互功能，但不知从何下手的新朋友。我将带你从零开始，一步步搭建一个专业的前端开发环境，并最终创建一个属于你自己的、功能完善的交互式自定义块。

### 序章：准备工作 (Prerequisites)

在开始编码之前，你需要确保你的电脑上安装了以下工具。这些是现代前端开发的基石。

- **Node.js**: 我们所有的开发都基于 Node.js 环境。请访问 [Node.js 官网](https://nodejs.org/ "null") 下载并安装最新 LTS (长期支持) 版本。安装后，`npm` 包管理器也会被一并安装。
- **pnpm (推荐)** : 这是一个更快速、更高效的包管理器。安装完 Node.js 后，在终端（Terminal 或 PowerShell）中运行以下命令进行安装：

  ```
  npm install -g pnpm

  ```
- **代码编辑器**: 强烈推荐 **Visual Studio Code (VS Code)** ，它对 TypeScript 有着绝佳的支持，能大大提升你的开发体验。

### 第一步：初始化你的项目

与插件开发不同，我们的自定义块项目更加轻量，从一个干净的文件夹开始即可。

1. **创建项目文件夹**: 在你希望存放代码的地方，创建一个新的文件夹，例如 `siyuan-custom-block`。
2. **进入并初始化**: 打开你的终端，进入这个新创建的文件夹，然后运行以下命令来初始化项目：

    ```
    cd siyuan-custom-block
    pnpm init

    ```

   这个命令会为你生成一个 `package.json` 文件，这是我们项目的“身份证”。

### 第二步：了解并配置项目结构

现在，使用 VS Code 打开 `siyuan-custom-block` 文件夹。我们需要手动创建一些文件和目录，来搭建我们的开发框架。

**1. 创建目录和文件**请按照下面的结构，在你的项目中创建对应的文件夹和空白文件：

```
siyuan-custom-block/
├── src/              # 你的源代码将全部放在这里
│   └── modules/      # (可选) 用于存放复杂功能的子模块
│   └── index.ts      # 项目的主入口文件 (*我们主要在这里写代码*)
├── package.json      # 项目的包管理文件 (已自动生成)
├── tsconfig.json     # TypeScript 配置文件
└── webpack.config.js # Webpack 打包配置文件 (*项目的“引擎”*)

```

**2. 填充配置文件**接下来，将我们之前讨论并最终确定的配置内容，分别复制粘贴到对应的文件中。这些文件共同构成了我们强大而稳定的开发环境。

- **`package.json`**  **(项目清单与脚本)** : 定义了项目依赖和 `build`/`dev` 等便捷命令。
- **`webpack.config.js`**  **(打包核心)** : 这是整个工作流的“大脑”，它负责将我们用 TypeScript 编写的、模块化的 `src` 代码，智能地转换成思源笔记可以无缝执行的单一 JavaScript 脚本。
- **`tsconfig.json`**  **(TS编译器配置)** : 告诉 TypeScript 编译器如何检查和编译我们的代码。

**3. 安装依赖**配置好 `package.json` 后，在终端中运行以下命令，pnpm 会自动下载并安装所有我们需要的开发工具：

```
pnpm install

```

### 第三步：编写你的第一个自定义块功能

环境就绪，让我们来创造一个简单的交互功能：**在块内创建一个按钮，点击它时，会用思源的通知API弹出一个包含当前块ID的提示。**

打开 `src/index.ts` 文件，将下面的代码完整地粘贴进去。

```
// 步骤 1: 清空当前块，防止因代码重载导致按钮重复创建
this.innerHTML = '';

// 步骤 2: 创建一个按钮元素
const button = document.createElement('button');
button.textContent = '点我显示提示';

// 步骤 3 (可选): 给按钮添加一些样式，让它更美观
button.style.padding = '8px 16px';
button.style.border = '1px solid #dcdfe6';
button.style.borderRadius = '4px';
button.style.cursor = 'pointer';
button.style.backgroundColor = '#f4f4f5';
button.style.color = '#606266';

// 步骤 4: 定义点击按钮时要执行的动作
const showNotification = () => {
    // 调用思源笔记的内置通知 API
    fetch('/api/notification/pushMsg', {
        method: 'POST',
        body: JSON.stringify({
            msg: `你好！这是一个来自块ID ${this.dataset.nodeId} 的提示。`,
            timeout: 5000, // 消息显示 5 秒钟
        }),
    }).catch(error => console.error('发送通知失败:', error));
};

// 步骤 5: 将这个动作绑定到按钮的点击事件上
button.addEventListener('click', showNotification);

// 步骤 6: 将创建好的按钮添加到当前块元素中
this.append(button);

// 步骤 7: 返回一个“清理函数”
// 这是自定义块开发中至关重要的一步。
// 当这个块被删除或代码更新时，思源会自动调用这个函数。
return () => {
    // 在这里，我们需要移除之前添加的事件监听器，以防止内存泄漏
    button.removeEventListener('click', showNotification);
    console.log('提示按钮的事件监听器已成功清理！');
};

```

**重点理解**:

- **`this`** **关键字**: 在 `src/index.ts` 的顶层，`this` 就代表了当前这个自定义块的 `div` 元素，我们可以直接操作它。
- **`this.innerHTML = ''`** : 这是确保脚本可重复执行的关键，防止界面元素重复创建。
- **`return () =&gt; { ... }`** : 这是确保思源笔记性能的关键。返回的这个“清理函数”会在块被销毁时自动执行，我们必须在这里“打扫战场”，比如移除事件监听器、清除定时器等。

### 第四步：打包你的脚本

代码写好后，我们需要将它“编译打包”成最终的 JS 代码。

- **构建用于生产的代码**:

  ```
  pnpm run build

  ```
- **启动开发模式 (推荐！)** :

  ```
  pnpm run dev

  ```

  运行此命令后，Webpack 会持续监控你的 `src` 文件夹。每当你修改并**保存**文件时，它都会在后台自动重新打包，无需你再手动执行命令，极大提升开发效率！

执行成功后，项目根目录下会生成一个 `dist` 文件夹，里面会有一个 `QianQian.js` 文件（根据你的配置命名）。这就是我们最终需要的产物！

### 第五步：在思源笔记中见证奇迹

现在，让我们把劳动成果应用到思源笔记中！

1. **获取代码**: 用 VS Code 打开 `dist/QianQian.js` 文件，复制里面的**全部内容**。
2. **创建自定义块**: 在思源笔记的任意文档中，输入 `/` 呼出菜单，选择“自定义JS块”。
3. **粘贴代码**:

    - 点击新创建的块右上角的 `···` 菜单，选择“块属性”。
    - 在属性面板中，找到名为 `custom-js` 的属性。
    - 将你刚刚复制的**所有代码**，完整地粘贴到 `custom-js` 的输入框中，然后按回车确认。
4. **查看效果**: 粘贴完成后，你的自定义块里应该立刻就出现了一个“点我显示提示”的按钮！点击它试试，屏幕中央是不是弹出了包含块ID的提示？

**调试技巧**：在思源笔记中，按下 `Ctrl+Shift+I` (Windows) 或 `Cmd+Opt+I` (Mac) 可以打开“开发者工具”，在 `Console` (控制台) 标签页中，你可以看到 `console.log` 输出的信息，这对于查找代码错误非常有帮助。

### 总结

恭喜你！你已经成功创建并运行了你的第一个交互式自定义块。

回顾一下我们的步骤：

1. **准备环境**: 安装 Node.js, pnpm。
2. **搭建项目**: 创建文件夹，并配置好 `package.json`, `webpack.config.js` 和 `tsconfig.json`。
3. **编写代码**: 在 `src/index.ts` 中实现了创建按钮、绑定事件和返回清理函数的完整逻辑。
4. **打包构建**: 使用 `pnpm run build` 或 `pnpm run dev` 生成最终的 JS 脚本。
5. **应用测试**: 将脚本粘贴到思源的 `custom-js` 块属性中并查看效果。

这只是一个开始。有了这套强大的工作流，你可以将任何现代前端技术（如数据可视化库、复杂的UI组件等）融入到你的思源笔记块中。尽情发挥你的创造力，去打造属于你自己的、独一无二的笔记体验吧！