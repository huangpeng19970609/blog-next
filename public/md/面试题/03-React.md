### 0 自问

1. JSX的本质是什么
   - 调用React.createElement
2. React的合成事件
3. 函数组件与class组件的区别
4. React 的 setState 是 异步还是同步的
5. 为什么需要react-redux
6. useEffect与componentDidMout的去呗
7. useEffect与useLaydouEffect的区别
8. React.memo与React.useMemo的区别
9. useCallBack与useMemo的区别
10. 

React:

- UI=render(data)

  用户看到的界面（UI），应该是一个函数（render）的执行结果，这个函数只接受数据（data）作为参数，且这个函数是一个纯函数

- React在构建用户界面整体遵循函数式的编程理念，即固定的输入有固定的输出，尤其是在推出函数式组件之后，更加强化了组件纯函数的理念。但实际业务中编写的组件不免要产生请求数据、订阅事件、手动操作DOM这些副作用（effect），这样难免让函数组件变得不那么纯，于是React提供use(Layout)Effect的hook，给开发者提供专门管理副作用的方式。


###  1 jsx的本质 

- 执行 React.createElement
- 格式化数据， 返回ReactElement对象
- 形成VDOM， 调用ReactDom.render进行渲染

是谁在做这件事情？

- babel ： 解析JSX语法代码转为JS代码

### 2 React的合成事件 (事件机制)

https://juejin.cn/post/6955636911214067720#heading-28

````js
    render() {
        return <h1 onClick= {change} >{this.state.isHot}</h1>
    }
````

- 【是什么】合成事件

  本应在真实DOM上注册事件， 仅是一个【noop函数】（空函数）

  document 注册了【事件监听器】， 即 document 统一管理所有的事件

- 【为什么要叫】合成事件

  除了事件委托，它更是帮我们合成了原生事件。

  1. 如 input的 onChange事件其可能会有 多个事件【blur、input、change等】多个事件来对应

- 【为什么使用】合成事件？

  1. 事件委托，让document统一管理，防止事件绑定在原生元素事件上的复杂情况。
  2. 兼容性， 合成事件可以抹平【不同浏览器的差异】

 `react`对事件是如何合成的。

 `react`事件是怎么绑定的。

`react`事件触发流程。

#### 01 |  事件合成-> 插件机制

- 【registrationNameModules】

  记录React合成事件 与 【对应的事件插件】的关系。

  ````json
  {
      onBlur: SimpleEventPlugin,
      onClick: SimpleEventPlugin,
      onClickCapture: SimpleEventPlugin,
      onChange: ChangeEventPlugin,
      onChangeCapture: ChangeEventPlugin,
      onMouseEnter: EnterLeaveEventPlugin,
      onMouseLeave: EnterLeaveEventPlugin,
      ...
  }
  ````

- 【registrationNameDependencies】模块

  记录合成事件比如 `onClick` 和原生事件 `click`对应关系

  ````js
  {
      onBlur: ['blur'],
      onClick: ['click'],
      onClickCapture: ['click'],
      onChange: ['blur', 'change', 'click', 'focus', 'input', 'keydown', 'keyup', 'selectionchange'],
      onMouseEnter: ['mouseout', 'mouseover'],
      onMouseLeave: ['mouseout', 'mouseover'],
      ...
  }
  
  ````

- 事件插件

  【SimpleEventPlugin】、【EnterLeaveEventPlugin】

  事件插件 以 【对象形式】实现，用作【事件统一处理函数】

#### 02 | 事件的初始化

*注册事件*

- 先【namesToPlugins】
- 再【recomputePluginOrdering】
- 最后 【**`publishEventForPlugin`**】

> 主要形成了上述的几个重要对象，构建初始化React合成事件和原生事件的对应关系，合成事件和对应的事件处理插件关系

#### 03 | 事件绑定



### 3 函数组件 与 class组件的区别

1. 函数组件无生命周期、类组件有生命周期

   （**类组件是通过各种生命周期函数来包装业务逻辑的**）

   函数组件因为 Hooks的提出焕然一新

2. 函数组件无状态、类组件有状态


### 4 React hook

v16.8 （2019年）的React Hook 将【函数组件】变得更要优雅。

### 5 React 的 setState 是 异步还是同步的？（类组件）

答案：不一定。

但 setState  的更新可能是同步的。因为 state、props的更新可能是同步的。

setState的回调任务，可能是异步也可能是同步。

- 在【原生事件】、【setTimeout】这种异步事件中，它表现的便是同步。

  由React控制之外的事件中调用setState是同步更新的。

  原因： 在执行异步代码的时候 ， 当前的执行栈中是同步的。

- 而在 【合成事件】、【生命周期钩子函数】上，表现的是异步。

  由React控制的事件处理程序，以及生命周期函数调用setState不会同步更新state 。

### 6 React-Redux

- 为什么我们需要Redux

  React 有props 与 state， props代表获取父级分发下来的属性，state代表组件内部自行管理的状态。

  故 React没有数据向上回溯的能力。即React的数据只能向下分发。

  1. 大多的时候发现React根本无法让两个组件互相交流，而我们总是通过提升state放置于共有的父组件来管理实现的。
  2. 子组件改变父组件state， 只能通过触发父组件声明好的回调。

  故我们现在需要一个更专业的工具来帮助我们实现此步骤。

- Redux

  1. 回调通知state -> action，更像是 依赖派发的 过程

     action是一个发送的事件 （data、action.type）

  2. 根据回调(action)处理 -> reducer， 依赖派发的结果

     reducer是一个匹配函数

  3. store (通过state、reducer来共同完成)

     state 仅是数据结构

      store负责存储状态并可以被react api回调，发布action

- Redux-React

  1. 为什么需要Provider

     这是一个普通的高阶组件，我们需要提供store，目的是它会将state分发给所有被connect的组件。

     不管它在哪里，被嵌套多少层。

     故 connect函数才是重点。

  2. connect函数

     参数一： mapStateToProps，注入你需要的Redux状态至props

     参数二： mapDispatchToProps，注入你需要的action至props， 他总是dispatch(action)

     dispatch 包裹它的目的便是为了触发reducer。

     柯里化函数参数： 将要绑定的组件本身

- 总结
  1. 顶层分发状态，让React组件被动地渲染。
  2. [监听事件](https://www.zhihu.com/search?q=监听事件&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A90782136})，事件有权利回到所有状态顶层影响状态。

### 7 实现一个简单的Redux

```js
function createStore(reducer) {
  let listeners = [];
  let currentState;
  function getState() {
    return currentState;
  }
  function dispatch(action) {
    currentState = reducer(currentState, action);
    listeners.forEach((l) => l());
  }
  function subscribe(fn) {
    listeners.push(fn);
    return function unsubscribe() {
      listeners = listeners.filter((l) => l !== fn);
    };
  }
  return {
    getState,
    dispatch,
    subscribe,
  };
}
```

### 8 useEffect 依赖传空数组和 componentDidMount 有什么区别吗？

- 空数组即代表没有任何依赖，只有在首次渲染触发一次

- 有区别，若是不给予第二个参数才是类似于 componentDidMount。

  componentDidMount代表是每一次挂载都会执行，而不是首次渲染才触发。

### 9 useeffect 和 useLayouteffect 区别

- 对于use（Layout）Effect来说，React做的事情就是

  - render阶段：函数组件开始渲染的时候，创建出对应的hook链表挂载到workInProgress的memoizedState上，并创建effect链表。
  - commit阶段：异步调度useEffect，layout阶段同步处理useLayoutEffect的effect。等到commit阶段完成，更新应用到页面上之后，开始处理useEffect产生的effect。

- 区别便在于【commit】

  useEffect和useLayoutEffect的执行时机不一样，前者被异步调度，当页面渲染完成后再去执行，不会阻塞页面渲染。

  而后者

- 总结

  1. 他们都用于存储effect链表。 都是在render阶段生成effect数据后将其拼接成链表，存储到fiber上。

  2. 区别在于最终的执行effect的时机不同

     一个异步一个同步。故异步使得useEffect不会阻塞渲染，而同步使得useLayoutEffect会阻塞渲染

  

### 10 React.memo()和 React.useMemo()

- 前言

  一段代码的示范

  这是一个递归函数，但存在非常多的冗余计算。故我们可以使用内存来换效率。

  ````js
  function fibonacci(n){
    return (n < 2) ? n : fibonacci(n-1) + fibonacci(n-2);
  }
  ````

  一般而言 props一旦发生变化，组件就会重新渲染

  依赖项一旦发生变化，组件就会重新渲染。当然React团队认为这种性能消耗非常低，可以忽略/开发者自行优化。

  但很多时刻固定的依赖项【渲染】固定的目标区域，与其他区域无关，此时memo的优化就很有必要了

- React.memo

  React 16版本发布。

  `React.memo()` 包裹组件,我们可以使用它来包装我们不想重新渲染的组件，除非其中的 props 发生变化

-  React.useMemo()

  `useMemo()` 是一个 React Hook，我们可以使用它在组件中包装函数。 我们可以使用它来确保该函数中的值仅在其依赖项之一发生变化时才重新计算
  
- 某种意义上 两者区别不是很大 都是缓存

### 11 useCallback 和 useMemo

useCallback 返回的缓存的是函数。

useMemo 一个缓存的是函数的返回值。

废话： 故 若是构建函数的过程很复杂应该使用 useCallback。若是 new 实例的过程很复杂则应该使用函数的返回值。

### 12 React.fiber 了解吗？造成卡顿的原因是什么？react.fiber 里面是怎么解决的？

1. 什么是Fiber

   **Fiber**是对React核心算法的重构。协调是react中重要的一部分，其中包含了如何对新旧树差异进行比较以达到仅更新差异的部分。

   **Fiber**  即 Fiber reconciler。 即 Fiber协调，分为两个阶段

   - 协调阶段

     当组件初始化与其后续更新阶段，React会创建两颗不同的虚拟树，计算哪些树需要更新

   - render阶段

     将虚拟树渲染到应用当中。

2. 浏览器会在什么时候卡顿? （Fiber是为了解决什么问题）

   浏览器的主线程需要处理GUI描绘，时间器处理，事件处理，JS执行，远程资源加载等，当做某件事，只有将它做完才能做下一件事。 主线程卡顿即卡顿。

3. 从代码的角度上

   fiber是一个js对象，将繁重的任务划分成一个个小的工作单元，做完后能够“喘口气儿”。一种增量渲染的调度，Fiber就是重新实现一个堆栈帧的调度，这个堆栈帧可以按照自己的调度算法执行他们

   - 把可中断的工作拆分成多个小任务
   - 为不同类型的更新分配任务优先级
   - 更新时能够暂停，终止，复用渲染任务

### 13 hooks 实现原理？不用链表可以用其他方法实现吗？



### 14 能在 if 判断里面写 hooks 吗？为什么不能？

- 这个限制并不是 React 团队凭空造出来的，的确是由于 React Hooks 的实现设计而不得已为之。

组件的某个属性上存在一个hook链表。链表上有很多节点（每个useState、useMemo）

每次更新的时候，都会根据原hook链表重新构建新hook链表。

那么一旦hooks里的链表有旧的值，多个if语句的时候 下一次state的值一定是获取旧的，而不是新的state的。

- 换言之

  当前的 hooks是对状态的维护，当你的状态发生了变化的时候，理论上我们应该立刻变更状态。但遗憾的是我们在本状态中无法获取最新状态，故有了这个限制。



### 15 redux 怎么挂载中间件的？它的执行顺序是什么样的？



### 16 redux 里面 dispatch 是如何正确找到 reducer 的？



### 17 react中的render（）的目的

render返回的是一个React元素，是原生DOM的表示。

本质是 通过 babel的编译变为js代码。 变为虚拟DOM => 变成真实DOM。

注： 公共方法render将被废除。 

### 18 props.children 与 React.children

1. 父组件的 prop.children 获取的是 所有子组件

2. React.children更像是函数助手，可以帮们动态修改所有子组件。

   但这个场景并不常见，并且影响健壮性。

### 19 react的版本变化

1. React15 版本 

   协调器 与 渲染器

   - 【协调器】主要负责根据自变量变化计算出UI变化。
   - 【渲染器】主要负责把UI变化渲染到宿主环境中。

   但有性能屏障

2. 

https://juejin.cn/post/7225254242358558777

### 20 React Hooks在平时开发中需要注意的问题和原因

