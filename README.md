# Shopping-Basket coding challenge

This is my solution to the coding challenge I got while applying for a job. It's written in ES6.
My goal was to make the discount functionality as extendable as possible without violating the YAGNI principle.
There are still plenty of potential problems when combining different discounts. Solutions to this would depend on the actual business logic of a real life implementation and exceed the boundaries of this challenge by far.
I keep free items, added as a discount, with the regular added item in the same basket. Those items should be marked as special or added to a separate basket, to avoid unintended behaviour later on.
Also, there is no way to remove items or discounts from a basket.

To run the project please use npm
```
npm install
npm start
```
The webserver will be available through http://localhost:8008/
Port 8008 is chosen to avoid common collisions with software like Skype. If there is still a port collision, please edit the port in webpack.config.js before running 'npm start'.

Later on I also added unit tests to cover nearly 100% of the code. I tested the code before, but only via integration tests. While this is a very small project I still discovered another, previously unnoticed, bug using unit tests. The bug could have led to doubled discounts, which in a real world scenario would cause financial loss. Just another proof that unit tests are not only almost always a good idea, but mandatory in many cases!

Tests can be executed by running
```
npm test
```
Coverage files are provided in several formats as well.

## Original text

Implement a virtual shopping-basket in the programming language of your choice (Java, Ruby, Elixir, JavaScript, ...). It should be possible to add items to the shopping-basket. Implementing a graphical user interface (GUI) is not necessary - it's enough to show the behavior using test cases. 
The following `API` shows the desired interface/behavior in pseudo-code. The final implementation can deviate from that.

### API
A warehouse has a set of products with fixed prices

```
INVENTORY = [["A0001", 12.99], ["A0002", 3.99], ...]
```

Each user has a shopping-basket

```
basket = Basket.new
```

It is possible to add items to the shopping-basket

```
basket.scan("A0001")
```

A user can check the total price of all items in his shopping basket at any given time

```
basket.total
=> 12.99
```

### Task
Additionally, certain sales deals shall be supported:

* Buy 1 get 1 free for a certain article

```
# Buy1Get1Free A0002
basket.scan("A0002")
basket.scan("A0001")
basket.scan("A0002")
basket.total
=> 16.98
```

* 10% off a given article

```
# 10Percent A0001
basket.scan("A0002")
basket.scan("A0001")
basket.scan("A0002")
basket.total
=> 19.67
```
