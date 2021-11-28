# test_task_11_19_2021
# Deploy: https://leonmisha.github.io/test_task_11_19_2021/
```
Email: test@gmail.com
Password: zvVzdWvWp1yVdyfbZZx0
```
# Техническое задание
```
Создать приложение крипто кошелек.
Страницы:
- Логин
- Дэшбоард
- Кошельки

Дэшбоард
После входа в систему, пользователь видит перед собой график с выбранной валютой (дать возможность пользователю менять валюты и в реальном времени подгружать новые данные под выбранную валюту. Базовая валюта BTC/USDT) (Валюты:  BTC, ETH)
Логин
Пользователю требуется ввести данные в форму с двумя полями : имейл и пароль, после чего его редиректит на страницу  "Дэшбоард".
* Для логина следует использовать локал сторедж либо InnoDb, где будет хранятся логин и пароль.
Кошельки
На странице отображается перечень кошельков :
 BTC, ETH, USDT
На кошельках отображается баланс, курс на данный момент и название кошелька. Пример можно взять с блокчейна.


Требования:
- Верстка может быть шаблонная, бутстрап либо шаблон с themeforest.
- Использовать websockets для передачи данных о валюте в реальном времени.
- На странице кошельки цена на данный момент отображается в реальном времени.
- График должен быть с японскими свечами 
- Либы :
Chart : https://ru.tradingview.com/HTML5-stock-forex-bitcoin-charting-library/
Tickers: https://www.cryptocompare.com/
```

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
