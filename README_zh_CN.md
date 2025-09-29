你好，未来的思源笔记创作者！

欢迎阅读这份为自定义块（Custom Block）量身打造的新手指南。本指南旨在帮助像你一样，希望在思源笔记中创造出强大交互功能，但不知从何下手的新朋友。我将带你从零开始，一步步搭建一个专业的前端开发环境，并最终创建一个集成了现代化样式（SCSS）的、功能完善的交互式自定义块。

### 序章：准备工作 (Prerequisites)

在开始编码之前，你需要确保你的电脑上安装了以下工具。这些是现代前端开发的基石。

- **Node.js**: 我们所有的开发都基于 Node.js 环境。请访问 [Node.js 官网](https://nodejs.org/ "null") 下载并安装最新 LTS (长期支持) 版本。安装后，`npm` 包管理器也会被一并安装。
- **pnpm (推荐)** : 这是一个更快速、更高效的包管理器。安装完 Node.js 后，在终端（Terminal 或 PowerShell）中运行以下命令进行安装：

  ```
  npm install -g pnpm

  ```
- **代码编辑器**: 强烈推荐 **Visual Studio Code (VS Code)** ，它对 TypeScript 和 SCSS 都有着绝佳的支持，能大大提升你的开发体验。

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
│   ├── modules/      # (可选) 用于存放复杂功能的子模块
│   ├── index.ts      # 项目的JS/TS主入口文件
│   └── style.scss    # 项目的样式主入口文件
├── package.json      # 项目的包管理文件 (已自动生成)
├── tsconfig.json     # TypeScript 配置文件
└── webpack.config.js # Webpack 打包配置文件 (项目的“引擎”)

```

**2. 填充配置文件**接下来，将我们之前讨论并最终确定的配置内容，分别复制粘贴到对应的文件中。这些文件共同构成了我们强大而稳定的开发环境。

- **`package.json`** (项目清单与脚本): 定义了项目依赖（包括SCSS工具）和 `build`/`dev` 等便捷命令。
- **`webpack.config.js`** (打包核心): 这是整个工作流的“大脑”，它负责将我们的TS和SCSS源代码，智能地转换成思源笔记可以无缝执行的独立JS和CSS文件。
- **`tsconfig.json`** (TS编译器配置): 告诉 TypeScript 编译器如何检查和编译我们的代码。

**3. 安装依赖**配置好 `package.json` 后，在终端中运行以下命令，pnpm 会自动下载并安装所有我们需要的开发工具：

```
pnpm install

```

### 第三步：编写你的第一个功能 (SCSS 加持版)

环境就绪，让我们来创造一个带有专业样式的交互功能：**在块内创建一个带有悬停效果的按钮，点击它时，会用思源的通知API弹出一个提示。**

**1. 编写样式 (****`src/style.scss`** **)** 首先，我们专注于“外观”。打开 `src/style.scss`，将下面的 SCSS 代码粘贴进去。

```
/* 为我们的自定义块创建一个唯一的根 class，用于样式隔离 */
.qianqian-custom-block {
    padding: 12px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* 按钮的样式 */
.qianqian-custom-block button {
    padding: 8px 16px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    cursor: pointer;
    background-color: #f4f4f5;
    color: #606266;
    transition: all 0.2s ease-in-out; // 添加过渡效果

    /* 使用 SCSS 的嵌套功能，轻松定义悬停效果 */
    &:hover {
        background-color: #409eff;
        color: #fff;
        border-color: #409eff;
        transform: translateY(-2px);
    }
}

```

**2. 编写逻辑 (****`src/index.ts`** **)** 接下来，我们处理“功能”。打开 `src/index.ts` 文件，将下面的代码完整地粘贴进去。

```
// 在文件顶部，引入我们的样式文件
// Webpack看到这行，就会自动处理 style.scss
import './style.scss';

// 步骤 1: 清空当前块，防止脚本重载导致按钮重复创建
this.innerHTML = '';

// 步骤 2: 为块元素应用我们在CSS中定义的根 class
this.className = 'qianqian-custom-block';

// 步骤 3: 创建一个按钮元素 (现在不再需要用JS写样式了)
const button = document.createElement('button');
button.textContent = '点我显示提示';

// 步骤 4: 定义点击按钮时要执行的动作
const showNotification = () => {
    fetch('/api/notification/pushMsg', {
        method: 'POST',
        body: JSON.stringify({
            msg: `你好！这是一个来自块ID ${this.dataset.nodeId} 的提示。`,
            timeout: 5000,
        }),
    }).catch(error => console.error('发送通知失败:', error));
};

// 步骤 5: 将动作绑定到按钮的点击事件上
button.addEventListener('click', showNotification);

// 步骤 6: 将按钮添加到当前块元素中
this.append(button);

// 步骤 7: 返回一个“清理函数”，用于移除事件监听，防止内存泄漏
return () => {
    button.removeEventListener('click', showNotification);
    console.log('提示按钮的事件监听器已成功清理！');
};

```

### 第四步：打包你的脚本

代码写好后，我们需要将它“编译打包”成最终的产物。

- **构建用于生产的代码**:

  ```
  pnpm run build

  ```
- **启动开发模式 (强烈推荐！)** :

  ```
  pnpm run dev

  ```

  运行此命令后，Webpack 会持续监控你的 `src` 文件夹。每当你修改并**保存**文件时，它都会在后台自动重新打包，极大提升开发效率！

执行成功后，项目根目录下会生成一个 `dist` 文件夹，里面会包含两个文件：`QianQian.js` 和 `QianQian.css`。

### 第五步：在思源笔记中见证奇迹

现在，让我们把劳动成果应用到思源笔记中！

1. **获取代码**:

    - 用 VS Code 打开 `dist/QianQian.js` 文件，复制里面的**全部内容**。
    - 用 VS Code 打开 `dist/QianQian.css` 文件，复制里面的**全部内容**。
2. **创建自定义块**: 在思源笔记的任意文档中，输入 `/` 呼出菜单，选择“自定义JS块”。
3. **粘贴代码**:

    - 点击新创建的块右上角的 `···` 菜单，选择“块属性”。
    - 在属性面板中，找到 `custom-js` 属性，将 JS 代码粘贴进去。
    - 找到 `custom-css` 属性（如果不存在，可以手动添加），将 CSS 代码粘贴进去。按回车确认。
4. **查看效果**: 完成后，你的自定义块里应该立刻就出现了一个漂亮的按钮！把鼠标放上去看看悬停效果，再点击它试试，屏幕中央是不是弹出了提示？

**调试技巧**: 在思源笔记中，按下 `Ctrl+Shift+I` (Windows) 或 `Cmd+Opt+I` (Mac) 可以打开“开发者工具”，在 `Console` (控制台) 标签页中，你可以看到 `console.log` 输出的信息，这对于查找代码错误非常有帮助。

### 总结

恭喜你！你已经成功创建并运行了你的第一个交互式自定义块。

回顾一下我们的步骤：

1. **准备环境**: 安装 Node.js, pnpm。
2. **搭建项目**: 创建文件夹，并配置好 `package.json`, `webpack.config.js` 和 `tsconfig.json`。
3. **编写代码**: 在 `src` 目录中，分离地编写了 `index.ts` (逻辑) 和 `style.scss` (表现)。
4. **打包构建**: 使用 `pnpm run build` 或 `pnpm run dev` 生成了独立的 `JS` 和 `CSS` 文件。
5. **应用测试**: 将脚本和样式分别粘贴到思源的 `custom-js` 和 `custom-css` 块属性中。

这只是一个开始。有了这套强大的工作流，你可以将任何现代前端技术融入到你的思源笔记块中。尽情发挥你的创造力，去打造属于你自己的、独一无二的笔记体验吧！
