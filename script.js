// 1. 获取 DOM 元素
const searchInput = document.getElementById('search-input');
const menuContainer = document.getElementById('menu-container');
const noResult = document.getElementById('no-result');
const menuItems = document.querySelectorAll('.menu-item');

// 2. 监听搜索框的输入事件
searchInput.addEventListener('input', function() {
  // 获取用户输入并转换为小写，方便忽略大小写匹配
  const searchTerm = this.value.toLowerCase().trim();
  
  let hasResult = false; // 标记是否有匹配的菜品

  // 3. 遍历所有菜品
  menuItems.forEach(item => {
    // 获取菜品标题（h3）的文本内容并转换为小写
    const title = item.querySelector('h3').textContent.toLowerCase();
    const desc = item.querySelector('p').textContent.toLowerCase();
    
    // 判断标题或描述中是否包含搜索词
    if (title.includes(searchTerm) || desc.includes(searchTerm)) {
      item.classList.remove('hidden'); // 显示匹配的菜品
      hasResult = true;
    } else {
      item.classList.add('hidden'); // 隐藏不匹配的菜品
    }
  });

  // 4. 如果没有匹配结果，显示提示
  if (hasResult) {
    noResult.classList.add('hidden');
  } else {
    noResult.classList.remove('hidden');
  }
});