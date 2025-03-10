# AI对战贪吃蛇游戏

这是一个特殊的贪吃蛇游戏，玩家可以与AI对战。游戏界面经过精心设计，提供了丰富的视觉效果和流畅的游戏体验。

## 游戏特点

1. **现代化界面**：精心设计的中文界面，包括动态分数显示、游戏控制按钮和规则说明
2. **多样化食物**：三种不同类型的食物（苹果、香蕉、浆果），每种都有独特的视觉效果和得分
3. **视觉效果**：蛇身具有圆角和渐变效果，食物有脉动动画，游戏背景带有网格线
4. **游戏控制**：支持开始、暂停和重新开始功能

## 游戏规则

1. **穿墙功能**：当蛇到达边界时，会从对面墙壁出现
2. **自身碰撞**：任何一条蛇碰到自己的身体，该蛇就输了
3. **蛇之间的碰撞**：玩家的蛇碰到AI蛇，玩家就输了
4. **得分规则**：吃到不同类型的食物会增加蛇的长度和相应的得分

## 操作方法

- 使用键盘的方向键（↑, ↓, ←, →）控制玩家蛇的移动方向
- 使用空格键暂停/继续游戏
- 点击"开始游戏"按钮开始新游戏，"暂停"按钮暂停游戏
- AI蛇会自动寻找食物并避开障碍物

## 技术实现

- 使用HTML5 Canvas进行游戏渲染
- 使用JavaScript实现游戏逻辑和动画效果
- AI蛇使用改进的A*寻路算法
- 响应式设计，适应不同屏幕尺寸

## 如何运行

1. 克隆此仓库到本地
2. 在项目根目录下启动一个HTTP服务器（例如：`python -m http.server 8000`）
3. 在浏览器中访问 `http://localhost:8000`

## 游戏截图

![游戏截图](https://github.com/Doitky/ai-vs-player-snake-game/blob/main/screenshot/screenshot.png)

## 未来改进计划

- 添加难度级别选择
- 实现多人在线对战模式
- 引入更多类型的食物和障碍物
- 优化AI算法，使其更具挑战性
- 添加音效和背景音乐
- 实现玩家积分排行榜功能

## 参与贡献

欢迎提交问题和改进建议！如果你想为这个项目做出贡献，请遵循以下步骤：

1. Fork 这个仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m '添加某个特性'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建一个 Pull Request

## 许可证

本项目采用 MIT 许可证。详情请见 [LICENSE](LICENSE) 文件。

## 联系方式

项目链接：[https://github.com/doitky/ai-vs-player-snake-game](https://github.com/yourusername/ai-vs-player-snake-game)

如果你有任何问题或建议，请通过上面的项目链接提交 issue。