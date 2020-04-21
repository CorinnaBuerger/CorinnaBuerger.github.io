---
layout: post
title:  "Decorators in Python"
date:   2020-04-20 19:50:00 +0200
categories: jekyll update
comments: true
---

If you have read my previous post about compairing iteration and recursion for getting a certain Fibonacci number F<sub>n</sub>, you may have noticed that I timed these two functions by creating a function called `time_it` that simply calls each function and checks the time that has passed since the beginning right before and after each function gets called a certain number of `times`. You may say, it "wrappes" the called function by doing something before and after the call.

{% highlight python %}
from time import perf_counter

def time_it(times, function, argument):
    start = perf_counter()
    for _ in range(times):
        function(argument)
    end = perf_counter()
    return end - start
{% endhighlight %}

The structure of this function resembles a concept in Python called **Decorators**.

In Python you can use Decorators to modify or "decorate" your functions. For beginners, it might not be that easy understanding the whole concept behind this, especially when you work with additional arguments in your decorator like we will later use it in our `time_it` function.

# Basic Structure

So let's start with the basic structure of a decorator and the decorated function without adding any additional arguments to the decorator!
Right below you can see a brief overlook of how it should look like when we are done. After this, I will explain its content step by step.

{% highlight python %}
def decorator(function):
    def wrapper(func_argument1, func_argument2):
        print("I modify the called function")
        return function(func_argument1, func_argument2)
    return wrapper

@decorator
def simple_function(func_argument1, func_argument2):
    print("I get decorated")
    return func_argument1 + func_argument2
{% endhighlight %}

In our example, we decorate `simple_function` with the string "I modify the called function". So when we execute it, we get:

{% highlight python %}
decorated_function(1, 2)

###############
# Output:
# I modify the called function
# I get decorated
# 3
{% endhighlight %}

Now that you got an idea of how it should look like, I will start with the structure of the decorator.
The decorator itself just takes exactly one argument: the `function`, that should be decorated. 
In the decorator's body we define another function: the so-called `wrapper`. It contains the actual modification or decoration and takes the **same arguments as the decorated function**. After modification the `wrapper` `returns` the function call of the decorated function. 
At the end, the decorator `returns` the `wrapper`, so the wrapped function gets executed.

For me in the beginning, it was not instantly clear why we need this additional `wrapper` in the decorator. Why can't we just pass `func_argument1` and `func_argument2` in the actual decorator and just let the decorator `return` the call of the decorated function?
To answer this question, you need to know what's behind this `@decorator` right above the definition of `simple_function`.

{% highlight python %}
@decorator
def simple_function(func_argument1, func_argument2): # simple_function gets decorated
    pass
{% endhighlight %}

is equal to

{% highlight python %}
def simple_function(func_argument1, func_argument2): 
    pass

decorated_function = decorator(simple_function) # simple_function gets decorated
{% endhighlight %}

By adding `@decorator` above the defintion of the `simple_function`, we call the decorator once with `simple_function` as an argument and importantly this is the only time the decorator gets executed. Since it does't get executed everytime you call the `decorated_function`, there is no way of passing it any function arguments. Decorators can indeed take arguments, but they can only be defined once, when the `simple_function` gets decorated. We will get back to this later.
In contrast to this, the `wrapper` gets executed everytime the `decorated_function` gets called and can accept arguments that are passed to it by the `decorated_function`. For this, you have to make sure that the `wrapper` takes the same parameters as the `decorated_function`. In case you don't know yet how many arguments will be passed to the `wrapper`, you can use `*args and **kwargs`. 

# Time it!

Now that you know about the basic structure of a decorator, let's take a look at our `time_it` function as a decorator!

{% highlight python %}
def time_it(function):
    def time_wrapper(fib_position):
        start = perf_counter()
        function(fib_position)
        end = perf_counter()
        return end - start
    return time_wrapper
{% endhighlight %}

As you can see, the `wrapper` does not necessarily have to `return` the function call. It can also execute the function and `return` another value like in our example the time it took to execute the function. Let's see what happens when we decorate our two functions `fib_iteration` and `fib_recursion` and call them afterwards:

{% highlight python %}
@time_it
def fib_iteration(fib_position):
    if fib_position == 1:
        return 1
    else:
        current = 1
        last = 0
        next_num = 0
        for _ in range(fib_position-1):
            next_num = current + last
            last = current
            current = next_num
        return current

@time_it
def fib_recursion(fib_position):
    if fib_position <= 2:
        return 1
    return fib_recursion(fib_position-1) + fib_recursion(fib_position-2)

print(fib_iteration(8)) 
print(fib_recursion(8))
{% endhighlight %}

This should `print` the time it takes both functions to return F<sub>8</sub>.

{% highlight python %}
###############
# Output:
# 1.3258000000002101e-05
# 0.00010263700000000264
{% endhighlight %}

This worked! Let's take it to another level!

# Decorators with arguments

Our original `time_it` function in our Fibonacci example took an additional argument: a certain number of `times` the measured function should be executed. But how can we pass arguments to a decorator when it only takes one argument: the function? Well, at first sight, this may not seem that easy but we will get through this. Just stay with me!
For this, we need a `decorator_maker`. It gets executed only once when a decorator is created and `returns` a new decorator.

{% highlight python %} 
def decorator_maker(dec_argument1, dec_argument2):
    def decorator_with_args(function):
        def wrapper(func_argument1, func_argument2):
            print("I modify the function")
            return function(func_argument1, func_argument2)
        return wrapper
    return decorator_with_args
{% endhighlight %}

Let's create a new decorator that can accept additional arguments:

{% highlight python %} 
new_decorator_with_args = decorator_maker(dec_argument1, dec_argument2)
{% endhighlight %}

And now we decorate a simple function with this new shiny decorator!

{% highlight python %} 
decorated_function = new_decorator_with_args(simple_function)
{% endhighlight %}

is the same as 

{% highlight python %}
decorated_function = decorator_maker(dec_argument1, dec_argument2)(simple_function)
{% endhighlight %}

is the same as

{% highlight python %}
@decorator_maker(dec_argument1, dec_argument2) # == new_decorator_with_args
def simple_function(func_argument1, func_argument2):
    pass
{% endhighlight %}

Let's try this out by measuring the time the functions `fib_iteration` and `fib_recursion` take to give us F<sub>8</sub> 10 `times`.

{% highlight python %}
from time import perf_counter

def decorator_maker_with_args(times):
    def time_it_with_arguments(function):
        def time_wrapper(fib_position):
            start = perf_counter()
            for _ in range(times):
                function(fib_position)
            end = perf_counter()
            return end - start
        return time_wrapper
    return time_it_with_arguments

@decorator_maker_with_args(10)
def fib_iteration(fib_position):
    if fib_position == 1:
        return 1
    else:
        current = 1
        last = 0
        next_num = 0
        for _ in range(fib_position-1):
            next_num = current + last
            last = current
            current = next_num
        return current

@decorator_maker_with_args(10)
def fib_recursion(fib_position):
    if fib_position <= 2:
        return 1
    return fib_recursion(fib_position-1) + fib_recursion(fib_position-2)

print(fib_iteration(8))
print(fib_recursion(8))

###############
# Output:
# 6.756900000000343e-05
# 21.540842741000002

{% endhighlight %}

Great, it worked!
Now if you want to change the number of `times` the measured functions should be executed, you only have to give decorator_maker_with_args another argument and it will be passed to the decorator.




