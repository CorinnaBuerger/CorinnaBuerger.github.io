---
layout: post
title:  "*args and **kwargs"
date:   2020-04-21 17:04:00 +0200
categories: jekyll update
comments: true
---

Have you ever wondered what's behind the mysterious expressions `*args` and `**kwargs`?
Usually they are used as function parameters, when you don't know the amount of given arguments yet. Let's say you want to define a function `mean` that returns the mean of all the numbers, that are passed to it. Surely, you want to create a function that can be applied for all amounts of numbers. In this case, you can use `*args` as a parameter.

```python
def mean(*args):
    sum_up = 0
    for num in args:
        sum_up = sum_up + num 
    mean = sum_up / len(args)
    return mean

print(mean(1, 2, 3))
print(mean(50, 100))
print(mean(4, 2, 9, 10))

################
# Output:
# 2.0
# 75.0
# 6.25
```
But what does `*args` exactly mean?
`*` is an unpacking operator. It can be used to unpack every iterable object.

```python
my_tuple = (1, 2, "hello", 4)
print(my_tuple)
print(*my_tuple)

###############
# Output:
# (1, 2, 'hello', 4)
# 1 2 hello 4
```
```python
my_list = [1, 2, 3, 4]
print(my_list)
print(*my_list)

###############
# Output:
# [1, 2, 3, 4]
# 1 2 3 4
```
Using `*` before the parameter `args` creates a tuple that now can contain any amount of any objects (integers, strings,...). `args` stands for positional **arg**ument**s**, but can be replaced by any other name. In our example function `mean`, we could also name it `*integers`. This lets us know, that no strings should be passed to the function since it would raise an error.

Until now, we just talked about `*args`. But when do we use `**kwargs`?
`**` is also an unpacking operator, but it can only be used for dictionaries, which contain **k**ey**w**ord **arg**ument**s**. Again, `kwargs` can be replaced by any other name.

```python
def meal(**recipe):
    for ingredient_type in recipe: # returns the key
        print(ingredient_type)
    for ingredient in recipe.values(): # returns the value
        print(ingredient)

meal(main_ingredient = "noodles", sauce = "tomatoe sauce", topping = "cheese", dessert = "ice cream")

###############
# Output:
# main_ingredient
# sauce
# topping
# dessert
# noodles
# tomatoe sauce
# cheese
# ice cream
```
`**` successfully unpacked our dictionary and made our keys and values accessible!



