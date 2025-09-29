// ----------------------------------------------------------------
// 导入依赖
// ----------------------------------------------------------------

// 步骤 1: 导入我们需要的模块
// 从功能模块中导入日志函数
import { logBlockId } from './modules/logger';
// 导入我们的样式文件，Webpack会自动处理它
import './style.scss';

// ----------------------------------------------------------------
// 这里是您自定义块的主要逻辑
// ----------------------------------------------------------------

// 打印一条消息到开发者控制台，确认脚本已成功加载
console.log("自定义块脚本已加载！");

// 步骤 2: 清空当前块，防止脚本重载导致按钮等界面元素重复创建
this.innerHTML = '';

// 步骤 3: 为块元素应用我们在 SCSS 中定义的根 class
// 这是连接JS逻辑和SCSS样式的“桥梁”。
this.className = 'qianqian-custom-block';

// 步骤 4: 动态创建一个按钮元素
const button = document.createElement('button');
button.textContent = '点我显示提示并记录日志';

// 步骤 5: 定义一个点击事件的处理函数
const handleClick = () => {
    // 调用从 logger.ts 模块导入的函数
    logBlockId(this);

    // 使用思源笔记的通知 API 发送一个消息
    fetch("/api/notification/pushMsg", {
        method: "POST",
        body: JSON.stringify({
            msg: `你好！这是一个来自块ID ${this.dataset.nodeId} 的提示。`,
            timeout: 5000 // 消息显示 5 秒钟
        })
    }).catch(error => console.error('发送通知失败:', error));
};

// 步骤 6: 将处理函数绑定到按钮的点击事件上
button.addEventListener('click', handleClick);

// 步骤 7: 将我们创建好的按钮，添加到当前块元素中
this.append(button);


// ----------------------------------------------------------------
// 清理函数
// ----------------------------------------------------------------

// **非常重要**：返回一个“清理函数”
// 当这个块被删除或代码更新时，思源会自动调用这个函数。
// 它的任务是“打扫战场”，比如移除事件监听器，以防止内存泄漏。
return () => {
    console.log('正在清理自定义块...');
    // 在这里，我们必须移除之前为按钮添加的事件监听器。
    button.removeEventListener('click', handleClick);
    console.log('提示按钮的事件监听器已成功清理！');
};

