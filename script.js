document.addEventListener('DOMContentLoaded', function() {
    let selectedDishes = {
        soup: null,
        main: null,
        drink: null
    };

    // Отображение блюд с сортировкой
    displayDishes();

    // Функция отображения блюд
    function displayDishes() {
        // Сортируем блюда по алфавиту
        const sortedDishes = [...dishes].sort((a, b) => a.name.localeCompare(b.name));
        
        // Группируем по категориям
        const categories = {
            soup: sortedDishes.filter(dish => dish.category === 'soup'),
            main: sortedDishes.filter(dish => dish.category === 'main'),
            drink: sortedDishes.filter(dish => dish.category === 'drink')
        };

        // Отображаем каждую категорию
        displayCategory('soup-dishes', categories.soup);
        displayCategory('main-dishes', categories.main);
        displayCategory('drink-dishes', categories.drink);

        // Обновляем корзину
        updateOrderSummary();
    }

    // Функция отображения категории
    function displayCategory(containerId, dishes) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Очищаем контейнер
        container.innerHTML = '';

        if (dishes.length === 0) {
            container.innerHTML = '<p>Блюда временно отсутствуют</p>';
            return;
        }

        // Создаем карточки блюд
        dishes.forEach(dish => {
            const dishElement = createDishElement(dish);
            container.appendChild(dishElement);
        });
    }

    // Функция создания элемента блюда
    function createDishElement(dish) {
        const dishDiv = document.createElement('div');
        dishDiv.className = 'dish-card';
        dishDiv.setAttribute('data-dish', dish.keyword);
        
        dishDiv.innerHTML = `
            <img src="${dish.image}" alt="${dish.name}" class="dish-image">
            <div class="dish-price">${dish.price} ₽</div>
            <div class="dish-name">${dish.name}</div>
            <div class="dish-weight">${dish.count}</div>
            <button class="add-button">Добавить</button>
        `;

        // Добавляем обработчик клика
        dishDiv.addEventListener('click', function() {
            selectDish(dish);
        });

        return dishDiv;
    }

    // Функция выбора блюда
    function selectDish(dish) {
        selectedDishes[dish.category] = dish;
        updateOrderSummary();
        
        // Визуальное выделение выбранного блюда
        document.querySelectorAll('.dish-card').forEach(card => {
            card.classList.remove('selected');
        });
        const selectedCard = document.querySelector(`[data-dish="${dish.keyword}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
    }

    // Функция обновления корзины
    function updateOrderSummary() {
        const orderSection = document.getElementById('order-items');
        const totalSection = document.getElementById('total-section');
        
        let hasSelectedDishes = false;
        let totalPrice = 0;
        let orderHTML = '';

        // Проверяем каждую категорию
        const categories = [
            { key: 'soup', name: 'Суп', emptyText: 'Блюдо не выбрано' },
            { key: 'main', name: 'Главное блюдо', emptyText: 'Блюдо не выбрано' },
            { key: 'drink', name: 'Напиток', emptyText: 'Напиток не выбран' }
        ];

        categories.forEach(cat => {
            const dish = selectedDishes[cat.key];
            if (dish) {
                hasSelectedDishes = true;
                totalPrice += dish.price;
                orderHTML += `
                    <div class="order-item">
                        <strong>${cat.name}</strong><br>
                        ${dish.name} ${dish.price}₽
                    </div>
                `;
            } else {
                orderHTML += `
                    <div class="order-item">
                        <strong>${cat.name}</strong><br>
                        ${cat.emptyText}
                    </div>
                `;
            }
        });

        // Обновляем отображение
        if (hasSelectedDishes) {
            orderSection.innerHTML = orderHTML;
            document.getElementById('total-price').textContent = totalPrice;
            totalSection.style.display = 'block';
        } else {
            orderSection.innerHTML = '<div class="empty-order">Ничего не выбрано</div>';
            totalSection.style.display = 'none';
        }
    }
});