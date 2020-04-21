---
layout: post
title:  "Decorators in Python"
date:   2020-04-20 19:50:00 +0200
categories: jekyll update
comments: true
---

In my previous post we compaired iteration and recursion concerning their needed time to get a certain Fibonacci number F<sub>n</sub>. For this, we created a function `time_it` that simply calls each function a certain number of `times` and returns the taken time by calculating the difference between the time right before and after the function gets called. You may say, it "wrappes" the called function.

```python
from time import perf_counter

def time_it(times, fn, arg):
    start = perf_counter()
    for _ in range(times):
        fn(arg)
    end = perf_counter()
    return end - start
```

The structure of this function resembles a concept in Python called **Decorators**.

In Python you can use Decorators to modify or "decorate" your functions. For beginners, it might not be that easy to understand how they are used in the right way, especially when you want to pass some additional arguments to your decorator.

# Basic Structure

Let's start with the basic structure of a decorator and the decorated function without adding any additional arguments to the decorator!

```python
def my_decorator(fn):
    def my_wrapper(fn_arg1, fn_arg2):
        print("I modify the called function")
        return function(fn_arg1, fn_arg2)
    return my_wrapper

@my_decorator
def simple_function(fn_arg1, fn_arg2):
    print("I get decorated")
    return fn_arg1 + fn_arg2
```

In our example, we decorate `simple_function` with the string "I modify the called function". So when we call our `simple_function`, we get:

```python
simple_function(1, 2)

###############
# Output:
# I modify the called function
# I get decorated
# 3
```

The decorator itself just takes exactly one argument: the function `fn` that should be decorated. 
In the decorator's body we define another function: the so-called `wrapper`. It contains the actual modification or decoration and takes the **same arguments as the decorated function**. After modification, the `wrapper` usually returns the function call of the decorated or modified function, but it can potentially return any value. We will come to this later on.
At the end, the decorator returns the `wrapper`.

For me in the beginning, it was not instantly clear why we need this additional `wrapper` in the decorator. Why can't we just pass `fn_arg1` and `fn_arg2` in the actual decorator and let the decorator return the call of the decorated function?
To answer this question, you need to know what's behind this `@decorator` right above the definition of `simple_function`.

```python
@my_decorator
def simple_function(fn_arg1, fn_arg2): # simple_function gets decorated
    pass
```

is equal to

```python
def simple_function(fn_arg1, fn_arg2): 
    pass

decorated_function = my_decorator(simple_function) # simple_function gets decorated
```

By adding `@decorator` above the defintion of the `simple_function`, we call the decorator once with `simple_function` as an argument and - importantly - this is the only time the decorator gets executed. Since it does't get executed everytime you call the `decorated_function`, there is no way of passing it any function arguments. Decorators can indeed take arguments, but they can only be defined once, when the `simple_function` gets decorated. We will get back to this later.
In contrast to this, the `wrapper` gets executed everytime the `decorated_function` gets called and can accept arguments that are passed to it by the `decorated_function`. For this, you have to make sure that the `wrapper` takes the same parameters as the `decorated_function`. In case you don't know yet how many arguments will be passed to the `wrapper`, you can use [*args and **kwargs](https://corinnabuerger.github.io/jekyll/update/2020/04/21/args_and_kwargs/). 

Maybe you have trouble unterstanding why the `wrapper` gets executed everytime the `decorated_function` gets called. Remember: When we call `my_decorator` in our example it returns `my_wrapper`:

```python
my_wrapper = my_decorator(simple_function)
```

Since `my_wrapper` is defined locally to `my_decorator`, it is not accessible from outside the decorator --- unless you return it.
By assigning `my_decorator(simple_function)` to `decorated_function` as we did above, you practically assign `my_wrapper` to `decorated_function`. So everytime you call `decorated_function`, you call `my_wrapper`.

# Time it!

Now that you know about the basic structure of a decorator, let's take a look at our `time_it` function as a decorator!

```python
def time_it(fn):
    def time_wrapper(n):
        start = perf_counter()
        fn(n)
        end = perf_counter()
        return end - start
    return time_wrapper
```

As you can see, the `wrapper` does not necessarily have to return the function call. It can also execute the decorated function and return another value like in our example the time it took to execute `fn`. Let's see what happens when we decorate our two functions `fib_iteration` and `fib_recursion` and call them afterwards:

```python
@time_it
def fib_iteration(n):
    if n == 1:
        return 1
    else:
        current = 1
        last = 0
        next_num = 0
        for _ in range(n-1):
            next_num = current + last
            last = current
            current = next_num
        return current

@time_it
def fib_recursion(n):
    if n <= 2:
        return 1
    return fib_recursion(n-1) + fib_recursion(n-2)

print(fib_iteration(8)) 
print(fib_recursion(8))
```

This does `print` the time it takes both functions to return F<sub>8</sub>.

```python
###############
# Output:
# 1.3258000000002101e-05
# 0.00010263700000000264
```

It worked! Let's take it to another level!

# Decorators with arguments

Our original `time_it` function in our Fibonacci example took an additional argument: a certain number of `times` the measured function should be executed. But how can we pass arguments to a decorator when it only takes one argument: the function `fn`? Well, at first sight, this may not seem that easy but we will get through this. Just stay with me!
For this, we need a `decorator_maker`. It gets executed only once when a decorator is created and returns a new decorator.

```python
def my_decorator_maker(dec_arg1, dec_arg2):
    def my_decorator_with_args(fn):
        def my_wrapper(fn_arg1, fn_arg2):
            print("I modify the function")
            return fn(fn_arg1, fn_arg2)
        return my_wrapper
    return my_decorator_with_args
```

Let's create a new decorator that can accept additional arguments:

```python
new_decorator_with_args = my_decorator_maker(dec_arg1, dec_arg2)
```

And now we decorate a simple function with this new shiny decorator!

```python
decorated_function = new_decorator_with_args(simple_function)
```

is the same as 

```python
decorated_function = my_decorator_maker(dec_arg1, dec_arg2)(simple_function)
```

is the same as

```python
@my_decorator_maker(dec_arg1, dec_arg2) # == new_decorator_with_args
def simple_function(fn_arg1, fn_arg2):
    pass
```

Let's try this out by measuring the time the functions `fib_iteration` and `fib_recursion` take to give us F<sub>8</sub> 10 `times`.

```python
from time import perf_counter

def decorator_maker_with_args(times):
    def time_it_with_arguments(fn):
        def time_wrapper(n):
            start = perf_counter()
            for _ in range(times):
                fn(n)
            end = perf_counter()
            return end - start
        return time_wrapper
    return time_it_with_arguments

@decorator_maker_with_args(10)
def fib_iteration(n):
    if n == 1:
        return 1
    else:
        current = 1
        last = 0
        next_num = 0
        for _ in range(n-1):
            next_num = current + last
            last = current
            current = next_num
        return current

@decorator_maker_with_args(10)
def fib_recursion(n):
    if n <= 2:
        return 1
    return fib_recursion(n-1) + fib_recursion(n-2)

print(fib_iteration(8))
print(fib_recursion(8))

###############
# Output:
# 6.756900000000343e-05
# 21.540842741000002

```

Great!
Now if you want to change the number of `times` the measured functions should be executed, you only have to give decorator_maker_with_args another argument and it will be passed to the decorator.





