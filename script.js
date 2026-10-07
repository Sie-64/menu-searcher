// 1. 获取 DOM 元素
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const mealsContainer = document.getElementById("meals");
const resultHeading = document.getElementById("result-heading");
const errorContainer = document.getElementById("error-container");
const mealDetails = document.getElementById("meal-details");
const mealDetailsContent = document.querySelector(".meal-details-content");
const backBtn = document.getElementById("back-btn");

// 2. API 基础 URL
const BASE_URL = "https://www.themealdb.com/api/json/v1/1/";
const SEARCH_URL = `${BASE_URL}search.php?s=`; // 根据菜名搜索
const LOOKUP_URL = `${BASE_URL}lookup.php?i=`; // 根据菜品 ID 查询详情

// 3. 事件绑定
searchBtn.addEventListener("click", searchMeals);

// 支持回车键搜索
searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchMeals();
});

// 使用事件委托，处理菜品卡片的点击
mealsContainer.addEventListener("click", handleMealClick);

// 返回按钮点击，隐藏详情页
backBtn.addEventListener("click", () => mealDetails.classList.add("hidden"));

// 4. 核心搜索函数
async function searchMeals() {
    const searchTerm = searchInput.value.trim();

    // 边界情况：如果没有输入任何内容
    if (!searchTerm) {
        errorContainer.innerHTML = "Please enter a search term";
        errorContainer.classList.remove("hidden");
        resultHeading.textContent = ""; // 清空标题
        mealsContainer.innerHTML = ""; // 清空列表
        return;
    }

    try {
        // 显示搜索中状态
        resultHeading.textContent = `Searching for "${searchTerm}"...`;
        mealsContainer.innerHTML = "";
        errorContainer.classList.add("hidden"); // 隐藏错误提示

        // 发起 API 请求
        const response = await fetch(`${SEARCH_URL}${searchTerm}`);
        const data = await response.json();

        if (data.meals === null) {
            // 没有搜索到任何菜品
            resultHeading.textContent = ``;
            mealsContainer.innerHTML = "";
            errorContainer.innerHTML = `No recipes found for "${searchTerm}". Try another search term!`;
            errorContainer.classList.remove("hidden");
        } else {
            // 搜索成功，展示菜品
            resultHeading.textContent = `Search results for "${searchTerm}":`;
            displayMeals(data.meals);
            searchInput.value = ""; // 清空输入框
        }
    } catch (error) {
        // 处理网络请求错误
        errorContainer.innerHTML = "Something went wrong. Please try again later.";
        errorContainer.classList.remove("hidden");
        resultHeading.textContent = "";
    }
}

// 5. 渲染菜品列表 (HTML 拼接)
function displayMeals(meals) {
    mealsContainer.innerHTML = "";
    meals.forEach((meal) => {
        mealsContainer.innerHTML += `
        <div class="meal" data-meal-id="${meal.idMeal}">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <div class="meal-info">
                <h3 class="meal-title">${meal.strMeal}</h3>
                ${meal.strCategory ? `<div class="meal-category">${meal.strCategory}</div>` : ""}
            </div>
        </div>
        `;
    });
}

// 6. 处理点击菜品卡片，获取并展示详情
async function handleMealClick(e) {
    const mealEl = e.target.closest(".meal");
    if (!mealEl) return; // 如果点击的不是卡片，直接返回

    const mealId = mealEl.getAttribute("data-meal-id");

    try {
        const response = await fetch(`${LOOKUP_URL}${mealId}`);
        const data = await response.json();

        if (data.meals && data.meals[0]) {
            const meal = data.meals[0];
            const ingredients = [];

            // 提取食材和用量
            for (let i = 1; i <= 20; i++) {
                if (meal[`strIngredient${i}`] && meal[`strIngredient${i}`].trim() !== "") {
                    ingredients.push({
                        ingredient: meal[`strIngredient${i}`],
                        measure: meal[`strMeasure${i}`],
                    });
                }
            }

            // 生成详情页 HTML
            mealDetailsContent.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="meal-details-img">
            <h2 class="meal-details-title">${meal.strMeal}</h2>
            <div class="meal-details-category">
                <span>${meal.strCategory || "Uncategorized"}</span>
            </div>
            <div class="meal-details-instructions">
                <h3>Instructions</h3>
                <p>${meal.strInstructions}</p>
            </div>
            <div class="meal-details-ingredients">
                <h3>Ingredients</h3>
                <ul class="ingredients-list">
                ${ingredients.map(item => `
                    <li><i class="fas fa-check-circle"></i> ${item.measure} ${item.ingredient}</li>
                `).join("")}
                </ul>
            </div>
            ${meal.strYoutube ? `
                <a href="${meal.strYoutube}" target="_blank" class="youtube-link">
                <i class="fab fa-youtube"></i> Watch Video
                </a>
            ` : ""}
            `;
            
            // 显示详情页并平滑滚动
            mealDetails.classList.remove("hidden");
            mealDetails.scrollIntoView({ behavior: "smooth" });
        }
    } catch (error) {
        errorContainer.innerHTML = "Could not load recipe details. Please try again later.";
        errorContainer.classList.remove("hidden");
    }
}