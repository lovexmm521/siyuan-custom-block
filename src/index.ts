// 引入其他模块，例如一个日志模块
import { logBlockId } from './modules/logger';

// ----------------------------------------------------------------
// 这里是您自定义块的主要逻辑
// ----------------------------------------------------------------

// 打印一条消息，确认脚本已加载
console.log("自定义块脚本已加载！");

// 设置块的初始样式，'this' 指向当前块的 DOM 元素
this.style.border = "2px solid steelblue";
this.style.padding = "10px";
this.style.borderRadius = "5px";
this.style.cursor = "pointer";

// 定义一个点击事件的处理函数
const handleClick = () => {
    // 调用从其他模块导入的函数
    logBlockId(this);

    // 使用思源笔记的通知 API 发送一个消息
    fetch("/api/notification/pushMsg", {
        method: "POST",
        body: JSON.stringify({
            msg: `您点击了块: ${this.getAttribute("data-node-id")}`,
            timeout: 3000
        })
    });
};

// 为当前块添加点击事件监听
this.addEventListener('click', handleClick);


// ----------------------------------------------------------------
// 清理函数
// ----------------------------------------------------------------

// **非常重要**：返回一个清理函数
// 当块被销毁或代码更新时，这个函数会被执行，用来移除事件监听，防止内存泄漏
return () => {
    console.log('正在清理自定义块...');
    this.removeEventListener('click', handleClick);
};

